import { Request, Response } from "express";

export interface Controllers {
	getContacts: (req: Request, res: Response) => Promise<void>;
}
