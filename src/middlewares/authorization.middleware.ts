import * as authorization from "auth-header";
import { NextFunction, Response } from "express";
import { IClinqRequest } from "../models";

export interface IAuth {
	scheme: string;
	params: string;
	token: string;
}

export const authorizationMiddleware: any = (
	req: IClinqRequest,
	res: Response,
	next: NextFunction
): void => {
	const auth: string = req.get("authorization");

	if (!auth) {
		res.sendStatus(401);
		return;
	}

	const { token } = authorization.parse(auth);

	req.token = token;

	next();
};
