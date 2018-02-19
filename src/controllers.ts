import { Response } from "express";

import { IBridgeImplementation, IClinqRequest } from "./models";

export interface IControllers {
	handleContacts: (req: IClinqRequest, res: Response) => Promise<any>;
}

export type ControllerFactory = (impl: IBridgeImplementation) => IControllers;

export const controllerFactory: ControllerFactory = (impl): IControllers => ({
	async handleContacts(req: IClinqRequest, res: Response): Promise<any> {
		const contacts: any[] = await impl.getContacts(req.token);

		res.send(contacts);
	}
});
