import { NextFunction, Request, Response } from "express";

import { Contact, Controllers, CrmAdapter } from "../models";

export type ControllerFactory = (adapter: CrmAdapter) => Controllers;

export const controllerFactory: ControllerFactory = (adapter): Controllers => ({
	async getContacts(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const contacts: Contact[] = await adapter.getContacts(req.apiKey);

			res.send(contacts);
		} catch (error) {
			next(error);
		}
	}
});
