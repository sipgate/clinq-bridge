import { Response } from "express";

import { BridgeImplementation, ClinqRequest, Controllers } from "./models";

export type ControllerFactory = (impl: BridgeImplementation) => Controllers;

export const controllerFactory: ControllerFactory = (impl): Controllers => ({
	async handleContacts(req: ClinqRequest, res: Response): Promise<any> {
		const contacts: any[] = await impl.getContacts(req.token);

		res.send(contacts);
	}
});
