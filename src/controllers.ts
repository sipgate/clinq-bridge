import { Request, Response } from "express";

import { IBridgemplementation } from "./bridge-implementation.model";

export interface IControllers {
	handleContacts: (req: Request, res: Response) => Promise<any>;
}

export type ControllerFactory = (impl: IBridgemplementation) => IControllers;

export const controllerFactory: ControllerFactory = (impl): IControllers => ({
	async handleContacts(req: Request, res: Response): Promise<any> {
		const contacts: any[] = await impl.getContacts();

		res.send(contacts);
	}
});
