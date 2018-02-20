import { Contact } from ".";

export interface CrmAdapter {
	getContacts: (token: string) => Promise<Contact[]>;
}
