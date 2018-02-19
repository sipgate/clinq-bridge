import { NextFunction, Request, Response } from "express";

import { ServerError } from "../models";

export const errorHandlerMiddleware: any = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ServerError) {
		return res.status(err.status).send(err.message);
	}

	res.status(500).send(err.message);
};
