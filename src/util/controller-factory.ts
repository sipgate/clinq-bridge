import { Request, Response } from "express";

import { Contact, Controllers, CrmAdapter } from "../models";

export type ControllerFactory = (adapter: CrmAdapter) => Controllers;

export const controllerFactory: ControllerFactory = (adapter): Controllers => ({
	async getContacts(req: Request, res: Response): Promise<void> {
		const contacts: Contact[] = await adapter.getContacts(req.token);

		res.send(contacts);
	}
});
