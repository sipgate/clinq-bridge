import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";
import { CookieOptions } from "express-serve-static-core";
import { Adapter, Config, Contact } from ".";
import contactsSchema from "../schemas/contacts";
import { BridgeRequest } from "./bridge-request.model";
import { ServerError } from "./server-error.model";

import queryString = require("querystring");
import { createIntegration, CreateIntegrationRequest } from "../api";

const APP_WEB_URL: string = "https://app.clinq.com/settings/integrations";
const SESSION_COOKIE_KEY: string = "CLINQ_AUTH";

const oAuthIdentifier: string = process.env.OAUTH_IDENTIFIER || "unknown";

function buildRedirectUrl(success: boolean = false): string {
	const query: string = queryString.stringify({ success });
	return `${APP_WEB_URL}?${query}`;
}

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
				res.redirect(buildRedirectUrl());
				return;
			}
			const { apiKey: key, apiUrl: url }: Config = await this.adapter.handleOAuth2Callback(req);
			const integration: CreateIntegrationRequest = { crm: oAuthIdentifier, token: key, url };
			await createIntegration(integration, authorizationHeader);
			res.redirect(buildRedirectUrl(true));
		} catch (error) {
			console.error("Unable to save OAuth2 token. Cause:", error.message);
			res.redirect(buildRedirectUrl());
		}
	}
}
