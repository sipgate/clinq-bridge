import { Request } from "express";

export interface ClinqRequest extends Request {
	token: string;
}
