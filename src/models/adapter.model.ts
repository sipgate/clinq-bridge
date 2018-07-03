import { Request } from "express";

import { Config, Contact } from ".";

export interface Adapter {
	getContacts: (config: Config) => Promise<Contact[]>;
	getOAuth2RedirectUrl?: () => Promise<string>;
	handleOAuth2Callback?: (req: Request) => Promise<Config>;
}
