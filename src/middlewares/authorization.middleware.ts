import * as authorization from "auth-header";
import { NextFunction, Request, Response } from "express";
import { AuthInfo, ServerError } from "../models";

export function authorizationMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const auth: string = req.get("authorization");

	if (!auth) {
		throw new ServerError(401, "Missing token.");
	}

	const { token }: AuthInfo = authorization.parse(auth);

	req.token = token;

	next();
}
