import { Request } from "express";

export interface IClinqRequest extends Request {
	token: string;
}
