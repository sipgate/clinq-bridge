import { CrmConfig } from "../models";

declare global {
	namespace Express {
		export interface Request {
			crmConfig: CrmConfig;
		}
	}
}
