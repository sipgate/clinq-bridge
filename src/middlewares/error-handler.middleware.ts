import { NextFunction, Request, Response } from "express";

import { ServerError } from "../models";

export function errorHandlerMiddleware(
	err: Error | ServerError,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (err instanceof ServerError) {
		res.status(err.status).send(err.message);
		return;
	}

	res.status(500).send(err.message);
}
