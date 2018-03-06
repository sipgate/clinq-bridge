import { NextFunction, Request, Response } from "express";
import { ServerError } from "../models";

export function extractHeaderMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const key: string = req.get("x-crm-key");
	const url: string = req.get("x-crm-url");

	if (!key) {
		throw new ServerError(401, "Missing apiKey.");
	}

	if (!url) {
		throw new ServerError(401, "Missing apiUrl.");
	}

	req.apiKey = key;
	req.apiUrl = url;

	next();
}
