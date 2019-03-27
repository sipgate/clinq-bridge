import { Contact, ContactCache } from "../models";

export class MockCache implements ContactCache {
	public get(key: string, getFreshValue?: (key: string) => Promise<Contact[] | null>): Promise<Contact[] | null> {
		return getFreshValue ? getFreshValue(key) : Promise.resolve(null);
	}

	public set(key: string, value: Contact[]): Promise<void> {
		return Promise.resolve();
	}

	public delete(key: string): Promise<void> {
		return Promise.resolve();
	}
}
