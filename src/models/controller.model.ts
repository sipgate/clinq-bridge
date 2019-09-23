import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";
import { stringify } from "querystring";
import { Adapter, Cache, CallEvent, Contact, ContactTemplate } from ".";
import { contactsSchema } from "../schemas/contacts";
import { anonymizeKey } from "../util/anonymize-key";
import { convertPhoneNumberToE164 } from "../util/phone-number-utils";
import { validate } from "../util/validate";
import { BridgeRequest } from "./bridge-request.model";
import { ContactUpdate } from "./contact.model";
import { ApiUser, ContactHook, HookEvent } from "./hook.model";
import { ServerError } from "./server-error.model";

const APP_WEB_URL: string = "https://www.clinq.app/settings/integrations/oauth/callback";
const CONTACT_FETCH_TIMEOUT: number = 3000;

const oAuthIdentifier: string = process.env.OAUTH_IDENTIFIER || "UNKNOWN";

function sanitizeContact(contact: Contact, locale: string): Contact {
	const result: Contact = {
		...contact,
		phoneNumbers: contact.phoneNumbers.map(phoneNumber => ({
			...phoneNumber,
			phoneNumber: convertPhoneNumberToE164(phoneNumber.phoneNumber, locale)
		}))
	};
	return result;
}

export class Controller {
	private adapter: Adapter;
	private cache: Cache;
	private ajv: Ajv.Ajv;

	constructor(adapter: Adapter, cache: Cache) {
		this.adapter = adapter;
		this.cache = cache;
		this.ajv = new Ajv();

		this.getContacts = this.getContacts.bind(this);
		this.createContact = this.createContact.bind(this);
		this.updateContact = this.updateContact.bind(this);
		this.deleteContact = this.deleteContact.bind(this);
		this.contactHook = this.contactHook.bind(this);
		this.updateApiUser = this.updateApiUser.bind(this);
		this.handleCallEvent = this.handleCallEvent.bind(this);
		this.handleConnectedEvent = this.handleConnectedEvent.bind(this);
		this.getHealth = this.getHealth.bind(this);
		this.oAuth2Redirect = this.oAuth2Redirect.bind(this);
		this.oAuth2Callback = this.oAuth2Callback.bind(this);
	}

	public async getContacts(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "", locale = "" } = {} } = req;
		try {
			const fetcherPromise = this.cache.get(apiKey, async () => {
				if (!this.adapter.getContacts) {
					throw new ServerError(501, "Fetching contacts is not implemented");
				}

				if (!req.providerConfig) {
					console.error("Missing config parameters");
					return null;
				}

				console.log(`Fetching contacts for key "${anonymizeKey(apiKey)}"`);

				const fetchedContacts: Contact[] = await this.adapter.getContacts(req.providerConfig);
				return validate(this.ajv, contactsSchema, fetchedContacts)
					? fetchedContacts.map(contact => sanitizeContact(contact, locale))
					: null;
			});
			const timeoutPromise: Promise<Contact[]> = new Promise(resolve =>
				setTimeout(() => resolve([]), CONTACT_FETCH_TIMEOUT)
			);
			const contacts = (await Promise.race([fetcherPromise, timeoutPromise])) as Contact[];
			const responseContacts: Contact[] = contacts || [];
			console.log(`Found ${responseContacts.length} cached contacts for key "${anonymizeKey(apiKey)}"`);
			res.send(responseContacts);

			await this.updateApiUser(req);
		} catch (error) {
			next(error);
		}
	}

	public async createContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "", locale = "" } = {} } = req;
		try {
			if (!this.adapter.createContact) {
				throw new ServerError(501, "Creating contacts is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			console.log(`Creating contact for key "${anonymizeKey(apiKey)}"`);

			const contact: Contact = await this.adapter.createContact(req.providerConfig, req.body as ContactTemplate);

			const valid = validate(this.ajv, contactsSchema, [contact]);

			if (!valid) {
				console.error("Invalid contact provided by adapter", this.ajv.errorsText());
				throw new ServerError(400, "Invalid contact provided by adapter");
			}

			const sanitizedContact: Contact = sanitizeContact(contact, locale);
			res.send(sanitizedContact);

			const cached = (await this.cache.get(apiKey)) as Contact[];
			if (cached) {
				await this.cache.set(apiKey, [...cached, sanitizedContact]);
			}
			await this.updateApiUser(req);
		} catch (error) {
			next(error);
		}
	}

	public async updateContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "", locale = "" } = {} } = req;
		try {
			if (!this.adapter.updateContact) {
				throw new ServerError(501, "Updating contacts is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			console.log(`Updating contact for key "${anonymizeKey(apiKey)}"`);

			const contact: Contact = await this.adapter.updateContact(
				req.providerConfig,
				req.params.id,
				req.body as ContactUpdate
			);

			const valid = validate(this.ajv, contactsSchema, [contact]);
			if (!valid) {
				console.error("Invalid contact provided by adapter", this.ajv.errorsText());
				throw new ServerError(400, "Invalid contact provided by adapter");
			}

			const sanitizedContact: Contact = sanitizeContact(contact, locale);
			res.send(sanitizedContact);

			const cachedContacts = (await this.cache.get(apiKey)) as Contact[];
			if (cachedContacts) {
				const updatedCache: Contact[] = cachedContacts.map(entry =>
					entry.id === sanitizedContact.id ? sanitizedContact : entry
				);
				await this.cache.set(apiKey, updatedCache);
			}
			await this.updateApiUser(req);
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

			console.log(`Deleting contact for key "${anonymizeKey(apiKey)}"`);

			const contactId: string = req.params.id;
			await this.adapter.deleteContact(req.providerConfig, contactId);
			res.status(200).send();

			const cached = (await this.cache.get(apiKey)) as Contact[];
			if (cached) {
				const updatedCache: Contact[] = cached.filter(entry => entry.id !== contactId);
				await this.cache.set(apiKey, updatedCache);
			}
			await this.updateApiUser(req);
		} catch (error) {
			next(error);
		}
	}

	public async contactHook(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.contactHook) {
				throw new ServerError(501, "Contacts hook is not implemented");
			}

			console.log(`Receive contact hook"`);

			const contactHook: ContactHook = await this.adapter.contactHook(req.headers, req.body);

			res.status(200).send();

			const validCreatedContact = validate(this.ajv, contactsSchema, [contactHook.contact]);
			if (!validCreatedContact) {
				console.error("Invalid contact provided by adapter", this.ajv.errorsText());
				throw new ServerError(400, "Invalid contact provided by adapter");
			}

			const cacheKey = `api_user_${contactHook.userId}`;
			const apiUser = (await this.cache.get(cacheKey)) as ApiUser;

			if (apiUser) {
				const sanitizedContact: Contact = sanitizeContact(contactHook.contact, apiUser.locale);
				const cachedContacts = (await this.cache.get(apiUser.apiKey)) as Contact[];

				switch (contactHook.event) {
					case HookEvent.CREATE:
						if (cachedContacts) {
							await this.cache.set(apiUser.apiKey, [...cachedContacts, sanitizedContact]);
						}
						break;
					case HookEvent.UPDATE:
						if (cachedContacts) {
							const updatedCache: Contact[] = cachedContacts.map(entry =>
								entry.id === sanitizedContact.id ? sanitizedContact : entry
							);
							await this.cache.set(apiUser.apiKey, updatedCache);
						}
						break;
					case HookEvent.DELETE:
						if (cachedContacts) {
							const updatedCache: Contact[] = cachedContacts.filter(entry => entry.id !== sanitizedContact.id);
							await this.cache.set(apiUser.apiKey, updatedCache);
						}
						break;
				}
			}
		} catch (error) {
			next(error);
		}
	}

	public async handleCallEvent(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "" } = {} } = req;
		try {
			if (!this.adapter.handleCallEvent) {
				throw new ServerError(501, "Handling call event is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			console.log(`Handling call event for key "${anonymizeKey(apiKey)}"`);

			await this.adapter.handleCallEvent(req.providerConfig, req.body as CallEvent);

			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}

	public async handleConnectedEvent(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		const { providerConfig: { apiKey = "" } = {} } = req;
		try {
			if (!this.adapter.handleConnectedEvent) {
				throw new ServerError(501, "Handling connected event is not implemented");
			}

			if (!req.providerConfig) {
				throw new ServerError(400, "Missing config parameters");
			}

			console.log(`Handling connected event for key "${anonymizeKey(apiKey)}"`);

			await this.adapter.handleConnectedEvent(req.providerConfig);

			res.status(200).send();

			await this.updateApiUser(req);
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

			const { apiKey, apiUrl } = await this.adapter.handleOAuth2Callback(req);
			const params = stringify({ name: oAuthIdentifier, key: apiKey, url: apiUrl });

			res.redirect(`${APP_WEB_URL}?${params}`);
		} catch (error) {
			console.error("Unable to save OAuth2 token. Cause:", error.message);
			res.redirect(APP_WEB_URL);
		}
	}

	private async updateApiUser(req: BridgeRequest): Promise<void> {
		const { providerConfig: { apiKey = "", locale = "" } = {} } = req;

		if (!this.adapter.getStaffMember) {
			console.debug("Fetching staff member not implemented");
			return;
		}
		if (!req.providerConfig) {
			console.error("Missing config parameters");
			return;
		}

		const staffMember = await this.adapter.getStaffMember(req.providerConfig);
		const cachedApiUser = (await this.cache.get(apiKey)) as ApiUser;

		if (
			!cachedApiUser ||
			cachedApiUser.apiKey !== apiKey ||
			cachedApiUser.userId !== staffMember.id ||
			cachedApiUser.locale !== locale
		) {
			const apiUser: ApiUser = {
				userId: staffMember.id,
				apiKey,
				locale
			};

			await this.cache.set(`api_user_${staffMember.id}`, apiUser);
		}
	}
}
