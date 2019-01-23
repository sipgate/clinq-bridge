import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";
import { CookieOptions } from "express-serve-static-core";
import { Adapter, Config, Contact, ContactTemplate } from ".";
import { createIntegration, CreateIntegrationRequest } from "../api";
import { contactsSchema } from "../schemas";
import { BridgeRequest } from "./bridge-request.model";
import { ContactUpdate } from "./contact.model";
import { ServerError } from "./server-error.model";

const APP_WEB_URL: string = "https://www.clinq.app/settings/integrations";
const SESSION_COOKIE_KEY: string = "CLINQ_AUTH";

const oAuthIdentifier: string = process.env.OAUTH_IDENTIFIER || "UNKNOWN";

export class Controller {
	private adapter: Adapter;
	private ajv: Ajv.Ajv;

	constructor(adapter: Adapter) {
		this.adapter = adapter;
		this.ajv = new Ajv();

		this.getContacts = this.getContacts.bind(this);
		this.createContact = this.createContact.bind(this);
		this.updateContact = this.updateContact.bind(this);
		this.deleteContact = this.deleteContact.bind(this);
		this.getHealth = this.getHealth.bind(this);
		this.oAuth2Redirect = this.oAuth2Redirect.bind(this);
		this.oAuth2Callback = this.oAuth2Callback.bind(this);
	}

	public async getContacts(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const contacts: Contact[] = await this.adapter.getContacts(req.providerConfig);
			const valid: boolean | PromiseLike<boolean> = this.ajv.validate(contactsSchema, contacts);
			if (!valid) {
				throw new ServerError(400, "Invalid contacts provided by adapter.");
			}
			res.send(contacts);
		} catch (error) {
			next(error);
		}
	}

	public async createContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.createContact) {
				throw new ServerError(501, "Creating contacts is not implemented.");
			}
			const contact: Contact = await this.adapter.createContact(req.providerConfig, req.body as ContactTemplate);
			const valid: boolean | PromiseLike<boolean> = this.ajv.validate(contactsSchema, [contact]);
			if (!valid) {
				throw new ServerError(400, "Invalid contact provided by adapter.");
			}
			res.send(contact);
		} catch (error) {
			next(error);
		}
	}

	public async updateContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.updateContact) {
				throw new ServerError(501, "Updating contacts is not implemented.");
			}
			const contact: Contact = await this.adapter.updateContact(
				req.providerConfig,
				req.params.id,
				req.body as ContactUpdate
			);
			const valid: boolean | PromiseLike<boolean> = this.ajv.validate(contactsSchema, [contact]);
			if (!valid) {
				throw new ServerError(400, "Invalid contact provided by adapter.");
			}
			res.send(contact);
		} catch (error) {
			next(error);
		}
	}

	public async deleteContact(req: BridgeRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.deleteContact) {
				throw new ServerError(501, "Deleting contacts is not implemented.");
			}
			await this.adapter.deleteContact(req.providerConfig, req.params.id);
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
				throw new ServerError(501, "OAuth2 flow not implemented.");
			}
			const redirectUrl: string = await this.adapter.getOAuth2RedirectUrl();
			const token: string = req.get("Authorization");
			if (typeof token === "string") {
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
				throw new ServerError(501, "OAuth2 flow not implemented.");
			}
		} catch (error) {
			next(error);
		}

		try {
			const authorizationHeader: string = req.cookies[SESSION_COOKIE_KEY];
			if (!authorizationHeader) {
				console.error("Unable to save OAuth2 token: Unauthorized.");
				res.redirect(APP_WEB_URL);
				return;
			}
			const { apiKey: key, apiUrl: url }: Config = await this.adapter.handleOAuth2Callback(req);
			const integration: CreateIntegrationRequest = { crm: oAuthIdentifier, token: key, url };
			await createIntegration(integration, authorizationHeader);
			res.redirect(APP_WEB_URL);
		} catch (error) {
			console.error("Unable to save OAuth2 token. Cause:", error.message);
			res.redirect(APP_WEB_URL);
		}
	}
}
