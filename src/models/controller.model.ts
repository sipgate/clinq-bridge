import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";
import { CookieOptions } from "express-serve-static-core";
import { Adapter, CallEvent, Config, Contact, ContactCache, ContactTemplate } from ".";
import { createIntegration, CreateIntegrationRequest } from "../api";
import { contactsSchema } from "../schemas";
import { anonymizeKey } from "../util/anonymize-key";
import { convertPhonenumberToE164 } from "../util/phone-number-utils";
import { BridgeRequest } from "./bridge-request.model";
import { ContactUpdate } from "./contact.model";
import { ServerError } from "./server-error.model";

const APP_WEB_URL: string = "https://www.clinq.app/settings/integrations";
const SESSION_COOKIE_KEY: string = "CLINQ_AUTH";
const CONTACT_FETCH_TIMEOUT: number = 1000;

const oAuthIdentifier: string = process.env.OAUTH_IDENTIFIER || "UNKNOWN";

function sanitizeContact(contact: Contact): Contact {
	const result: Contact = {
		...contact,
		phoneNumbers: contact.phoneNumbers.map(phoneNumber => ({
			...phoneNumber,
			phoneNumber: convertPhonenumberToE164(phoneNumber.phoneNumber)
		}))
	};
	return result;
}

export class Controller {
	private adapter: Adapter;
	private contactCache: ContactCache;
	private ajv: Ajv.Ajv;

	constructor(adapter: Adapter, contactCache: ContactCache) {
		this.adapter = adapter;
		this.contactCache = contactCache;
		this.ajv = new Ajv();

		this.getContacts = this.getContacts.bind(this);
		this.createContact = this.createContact.bind(this);
		this.updateContact = this.updateContact.bind(this);
		this.deleteContact = this.deleteContact.bind(this);
		this.handleCallEvent = this.handleCallEvent.bind(this);
		this.getHealth = this.getHealth.bind(this);
		this.oAuth2Redirect = this.oAuth2Redirect.bind(this);
		this.oAuth2Callback = this.oAuth2Callback.bind(this);
	}

	public async getContacts(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "" } = {} } = req;
		try {
			const fetcherPromise = this.contactCache.get(apiKey, async () => {
				console.log(`Fetching contacts for key "${anonymizeKey(apiKey)}"`);

				if (!req.providerConfig) {
					console.error("Missing config parameters");
					return null;
				}

				const fetchedContacts: Contact[] = await this.adapter.getContacts(req.providerConfig);
				const valid: boolean | PromiseLike<boolean> = this.ajv.validate(contactsSchema, fetchedContacts);
				if (!valid) {
					console.error("Invalid contacts provided by adapter", this.ajv.errorsText());
					return null;
				}
				return fetchedContacts.map(sanitizeContact);
			});
			const timeoutPromise: Promise<Contact[]> = new Promise(resolve =>
				setTimeout(() => resolve([]), CONTACT_FETCH_TIMEOUT)
			);
			const contacts = await Promise.race([fetcherPromise, timeoutPromise]);
			const responseContacts: Contact[] = contacts || [];
			console.log(`Found ${responseContacts.length} cached contacts for key "${anonymizeKey(apiKey)}"`);
			res.send(responseContacts);
		} catch (error) {
			next(error);
		}
	}

	public async createContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "" } = {} } = req;
		try {
			if (!this.adapter.createContact) {
				throw new ServerError(501, "Creating contacts is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			const contact: Contact = await this.adapter.createContact(req.providerConfig, req.body as ContactTemplate);
			const valid: boolean | PromiseLike<boolean> = this.ajv.validate(contactsSchema, [contact]);
			if (!valid) {
				console.error("Invalid contact provided by adapter", this.ajv.errorsText());
				throw new ServerError(400, "Invalid contact provided by adapter");
			}

			const sanitizedContact: Contact = sanitizeContact(contact);
			res.send(sanitizedContact);

			const cached = await this.contactCache.get(apiKey);
			if (cached) {
				await this.contactCache.set(apiKey, [...cached, sanitizedContact]);
			}
		} catch (error) {
			next(error);
		}
	}

	public async updateContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "" } = {} } = req;
		try {
			if (!this.adapter.updateContact) {
				throw new ServerError(501, "Updating contacts is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			const contact: Contact = await this.adapter.updateContact(
				req.providerConfig,
				req.params.id,
				req.body as ContactUpdate
			);
			const valid: boolean | PromiseLike<boolean> = this.ajv.validate(contactsSchema, [contact]);
			if (!valid) {
				console.error("Invalid contact provided by adapter", this.ajv.errorsText());
				throw new ServerError(400, "Invalid contact provided by adapter");
			}

			const sanitizedContact: Contact = sanitizeContact(contact);
			res.send(sanitizedContact);

			const cachedContacts = await this.contactCache.get(apiKey);
			if (cachedContacts) {
				const updatedCache: Contact[] = cachedContacts.map(
					entry => (entry.id === sanitizedContact.id ? sanitizedContact : entry)
				);
				await this.contactCache.set(apiKey, updatedCache);
			}
		} catch (error) {
			next(error);
		}
	}

	public async deleteContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "" } = {} } = req;
		try {
			if (!this.adapter.deleteContact) {
				throw new ServerError(501, "Deleting contacts is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			const contactId: string = req.params.id;
			await this.adapter.deleteContact(req.providerConfig, contactId);
			res.status(200).send();

			const cached = await this.contactCache.get(apiKey);
			if (cached) {
				const updatedCache: Contact[] = cached.filter(entry => entry.id !== contactId);
				await this.contactCache.set(apiKey, updatedCache);
			}
		} catch (error) {
			next(error);
		}
	}

	public async handleCallEvent(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.handleCallEvent) {
				throw new ServerError(501, "Handling call event is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			await this.adapter.handleCallEvent(req.providerConfig, req.body as CallEvent);

			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}

	public async getHealth(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			if (this.adapter.getHealth) {
				await this.adapter.getHealth();
			}
			res.sendStatus(200);
		} catch (error) {
			next(error || "Internal Server Error");
		}
	}

	public async oAuth2Redirect(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.getOAuth2RedirectUrl) {
				throw new ServerError(501, "OAuth2 flow not implemented");
			}
			const redirectUrl = await this.adapter.getOAuth2RedirectUrl();
			const token = req.get("Authorization");
			if (token) {
				const options: CookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
				res.cookie(SESSION_COOKIE_KEY, token, options);
			}
			res.send({ redirectUrl });
		} catch (error) {
			next(error);
		}
	}

	public async oAuth2Callback(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.handleOAuth2Callback) {
				throw new ServerError(501, "OAuth2 flow not implemented");
			}

			const authorizationHeader: string = req.cookies[SESSION_COOKIE_KEY];

			if (!authorizationHeader) {
				console.error("Unable to save OAuth2 token: Unauthorized");
				res.redirect(APP_WEB_URL);
				return;
			}

			const { apiKey: key, apiUrl: url }: Config = await this.adapter.handleOAuth2Callback(req);
			const integration: CreateIntegrationRequest = { name: oAuthIdentifier, key, url };

			await createIntegration(integration, authorizationHeader);

			res.redirect(APP_WEB_URL);
		} catch (error) {
			console.error("Unable to save OAuth2 token. Cause:", error.message);
			res.redirect(APP_WEB_URL);
		}
	}
}
