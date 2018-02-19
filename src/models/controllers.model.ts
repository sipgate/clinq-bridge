import { Response } from "express";

import { ClinqRequest } from "./clinq-request.model";

export interface Controllers {
	handleContacts: (req: ClinqRequest, res: Response) => Promise<any>;
}
