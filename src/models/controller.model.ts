import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";

import { Contact, CrmAdapter } from ".";
import contactsSchema from "../schemas/contacts";
import { ServerError } from "./server-error.model";

const APP_WEB_URL: string = "https://app.sipgate.com/w0/crm/oauth2";

export class Controller {
	private adapter: CrmAdapter;
	private ajv: Ajv.Ajv;
	private contactsValidator: Ajv.ValidateFunction;

	constructor(adapter: CrmAdapter) {
		this.adapter = adapter;
		this.ajv = new Ajv();

		this.getContacts = this.getContacts.bind(this);
		this.oAuth2Redirect = this.oAuth2Redirect.bind(this);
		this.oAuth2Callback = this.oAuth2Callback.bind(this);
	}

	public async getContacts(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const contacts: Contact[] = await this.adapter.getContacts(req.crmConfig);
			const valid: boolean | Ajv.Thenable<boolean> = this.ajv.validate(
				contactsSchema,
				contacts
			);
			if (!valid) {
				throw new ServerError(400, "Invalid contacts provided by adapter.");
			}
			res.send(contacts);
		} catch (error) {
			next(error);
		}
	}

	public async oAuth2Redirect(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!this.adapter.getOAuth2RedirectUrl) {
			res.status(501).send();
			return;
		}
		try {
			const redirectUrl: string = await this.adapter.getOAuth2RedirectUrl();
			res.redirect(redirectUrl);
		} catch (error) {
			next(error);
		}
	}

	public async oAuth2Callback(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!this.adapter.handleOAuth2Callback) {
			res.status(501).send();
			return;
		}
		try {
			const accessToken: string = await this.adapter.handleOAuth2Callback(req);
			res.redirect(
				`${APP_WEB_URL}/${this.adapter.crmIdentifier}?token=${accessToken}`
			);
		} catch (error) {
			next(error);
		}
	}
}
