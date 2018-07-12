import { NextFunction, Response } from "express";
import { BridgeRequest } from "../models";

export function extractHeaderMiddleware(req: BridgeRequest, res: Response, next: NextFunction): void {
	const key: string = req.get("x-provider-key") || req.get("x-crm-key");
	const url: string = req.get("x-provider-url") || req.get("x-crm-url");

	req.providerConfig = {
		apiKey: key,
		apiUrl: url
	};

	next();
}
