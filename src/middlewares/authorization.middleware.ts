import * as authorization from "auth-header";
import { NextFunction, Response } from "express";
import { ClinqRequest, ServerError } from "../models";

export interface IAuth {
	scheme: string;
	params: string;
	token: string;
}

export function authorizationMiddleware(
	req: ClinqRequest,
	res: Response,
	next: NextFunction
): void {
	const auth: string = req.get("authorization");

	if (!auth) {
		throw new ServerError(401, "Missing token.");
	}

	const { token } = authorization.parse(auth);

	req.token = token;

	next();
}
