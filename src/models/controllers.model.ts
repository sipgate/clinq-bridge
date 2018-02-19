import { Response } from "express";

import { ClinqRequest, Contact } from ".";

export interface Controllers {
	handleContacts: (req: ClinqRequest, res: Response) => Promise<Contact[]>;
}
