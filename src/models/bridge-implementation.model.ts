import { Contact } from ".";

export interface BridgeImplementation {
	getContacts: (token: string) => Promise<Contact[]>;
}
