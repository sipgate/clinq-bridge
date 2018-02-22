import * as authorization from "auth-header";
import { NextFunction, Request, Response } from "express";
import { AuthInfo, ServerError } from "../models";

export function authorizationMiddleware(
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

	const { token }: AuthInfo = authorization.parse(key);

	req.apiKey = token;
	req.apiUrl = token;

	next();
}
