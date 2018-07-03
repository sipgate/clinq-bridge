import { NextFunction, Request, Response } from "express";
import { ServerError } from "../models";

export function extractHeaderMiddleware(req: Request, res: Response, next: NextFunction): void {
	const key: string = req.get("x-crm-key");
	const url: string = req.get("x-crm-url");

	req.config = {
		apiKey: key,
		apiUrl: url
	};

	next();
}
