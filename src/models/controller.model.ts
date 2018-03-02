import * as Ajv from "ajv";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "./server-error.model";

import contactsSchema from "../schemas/contacts";

import { Contact, CrmAdapter } from ".";

export class Controller {
	private adapter: CrmAdapter;
	private ajv: Ajv.Ajv;
	private contactsValidator: Ajv.ValidateFunction;

	constructor(adapter: CrmAdapter) {
		this.adapter = adapter;
		this.ajv = new Ajv();

		this.getContacts = this.getContacts.bind(this);
	}

	public async getContacts(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const contacts: Contact[] = await this.adapter.getContacts({
				apiKey: req.apiKey,
				apiUrl: req.apiUrl
			});
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
}
