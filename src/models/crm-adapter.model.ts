import { Contact } from ".";

export interface CrmAdapter {
	getContacts: (apiKey: string) => Promise<Contact[]>;
}
