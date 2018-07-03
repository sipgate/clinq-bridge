import { NextFunction, Request, Response } from "express";
import { ServerError } from "../models";

export function extractHeaderMiddleware(req: Request, res: Response, next: NextFunction): void {
	const key: string = req.get("x-provider-key");
	const url: string = req.get("x-provider-url");

	req.config = {
		apiKey: key,
		apiUrl: url
	};

	next();
}
