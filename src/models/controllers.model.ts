import { NextFunction, Request, Response } from "express";

export interface Controllers {
	getContacts: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
}
