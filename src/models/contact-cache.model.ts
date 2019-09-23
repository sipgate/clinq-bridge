import { Contact } from "./contact.model";
import { ApiUser } from "./hook.model";

type FreshValueUpdater = (key: string) => Promise<Contact[] | ApiUser | null>;

export interface Cache {
	get: (key: string, getFreshValue?: FreshValueUpdater) => Promise<Contact[] | ApiUser | null>;
	set: (key: string, value: Contact[] | ApiUser) => Promise<void>;
	delete: (key: string) => Promise<void>;
}
