import { Cache, Contact } from "../models";
import { ApiUser } from "../models/staff.model";

export class MockCache implements Cache {
	public get(
		key: string,
		getFreshValue?: (key: string) => Promise<Contact[] | ApiUser | null>
	): Promise<Contact[] | ApiUser | null> {
		return getFreshValue ? getFreshValue(key) : Promise.resolve(null);
	}

	public set(key: string, value: Contact[] | ApiUser): Promise<void> {
		return Promise.resolve();
	}

	public delete(key: string): Promise<void> {
		return Promise.resolve();
	}
}
