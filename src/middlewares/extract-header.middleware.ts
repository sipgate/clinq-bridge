import { NextFunction, Response } from "express";
import { BridgeRequest } from "../models";

export function extractHeaderMiddleware(req: BridgeRequest, res: Response, next: NextFunction): void {
	const key: string = req.get("x-provider-key");
	const url: string = req.get("x-provider-url");

	req.providerConfig = {
		apiKey: key,
		apiUrl: url
	};

	next();
}
