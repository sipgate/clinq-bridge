import { Contact, CrmConfig } from ".";

export interface CrmAdapter {
	getContacts: (crmConfig: CrmConfig) => Promise<Contact[]>;
}
