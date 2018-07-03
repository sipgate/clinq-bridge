import { Config } from "../models";

declare global {
	namespace Express {
		export interface Request {
			config: Config;
		}
	}
}
