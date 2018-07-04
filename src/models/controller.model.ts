import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";
import queryString = require("querystring");

import { Adapter, Config, Contact } from ".";
import contactsSchema from "../schemas/contacts";
import { BridgeRequest } from "./bridge-request.model";
import { ServerError } from "./server-error.model";

const APP_WEB_URL: string = "https://app.clinq.com/settings/integrations/oauth2";

const oAuthIdentifier: string = process.env.OAUTH_IDENTIFIER || "unknown";

export class Controller {
	private adapter: Adapter;
	private ajv: Ajv.Ajv;

	constructor(adapter: Adapter) {
		this.adapter = adapter;
		this.ajv = new Ajv();

		this.getContacts = this.getContacts.bind(this);
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

	public async oAuth2Redirect(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.getOAuth2RedirectUrl) {
				throw new ServerError(501, "OAuth flow not implemented.");
			}
			const redirectUrl: string = await this.adapter.getOAuth2RedirectUrl();
			res.redirect(redirectUrl);
		} catch (error) {
			next(error);
		}
	}

	public async oAuth2Callback(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.adapter.handleOAuth2Callback) {
				throw new ServerError(501, "OAuth flow not implemented.");
			}
			const { apiKey: key, apiUrl: url }: Config = await this.adapter.handleOAuth2Callback(req);
			const query: string = queryString.stringify({ key, url });
			const redirectUrl: string = `${APP_WEB_URL}/${oAuthIdentifier}?${query}`;
			res.redirect(redirectUrl);
		} catch (error) {
			next(error);
		}
	}
}
