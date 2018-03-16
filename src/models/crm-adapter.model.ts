import { Request } from "express";

import { Contact, CrmConfig } from ".";

export interface CrmAdapter {
	crmIdentifier: string;
	getContacts: (crmConfig: CrmConfig) => Promise<Contact[]>;
	getOAuth2RedirectUrl?: () => Promise<string>;
	handleOAuth2Callback?: (req: Request) => Promise<string>;
}
