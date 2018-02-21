import { NextFunction, Request, Response } from "express";

import { Contact, CrmAdapter } from ".";

export class Controller {
	private adapter: CrmAdapter;

	constructor(adapter: CrmAdapter) {
		this.adapter = adapter;
	}

	public async getContacts(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const contacts: Contact[] = await this.adapter.getContacts(req.apiKey);
			res.send(contacts);
		} catch (error) {
			next(error);
		}
	}
}
