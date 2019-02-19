import { Contact, ContactCache } from "../models";
import { StorageAdapter } from "../models/storage-adapter.model";
import { anonymizeKey } from "../util/anonymize-key";

const MINIMUM_REFRESH_INTERVAL_MS: number = 1 * 60 * 1000; // 1 minutes
const MAXIMUM_REFRESH_INTERVAL_MS_DEFAULT: number = 5 * 60 * 1000; // 5 minutes

let MAXIMUM_REFRESH_INTERVAL_MS: number = MAXIMUM_REFRESH_INTERVAL_MS_DEFAULT;
const { CACHE_REFRESH_INTERVAL } = process.env;
if (CACHE_REFRESH_INTERVAL) {
	MAXIMUM_REFRESH_INTERVAL_MS = Math.max(parseInt(CACHE_REFRESH_INTERVAL, 10) * 1000, MINIMUM_REFRESH_INTERVAL_MS * 2);
}

export class StorageCache implements ContactCache {
	private storage: StorageAdapter<Contact[]>;
	private lastRefreshTimes: Map<string, number>;

	constructor(storageAdapter: StorageAdapter<Contact[]>) {
		this.storage = storageAdapter;
		this.lastRefreshTimes = new Map<string, number>();
		console.log(
			`Initialized storage cache with minimum refresh interval of ${MINIMUM_REFRESH_INTERVAL_MS /
				1000}s and maximum refresh interval of ${MAXIMUM_REFRESH_INTERVAL_MS / 1000}s.`
		);
	}

	public async get(
		key: string,
		getFreshValue: (key: string) => Promise<Contact[] | null> = null
	): Promise<Contact[] | null> {
		let value: Contact[];
		try {
			value = await this.storage.get(key);
			if (value) {
				console.log(`Found match for key "${anonymizeKey(key)}" in cache.`);

				const lastRefreshTime: number = this.lastRefreshTimes.get(key);
				if (!lastRefreshTime || new Date().getTime() > lastRefreshTime + MAXIMUM_REFRESH_INTERVAL_MS) {
					this.getRefreshed(key, getFreshValue);
				}

				return value;
			}
		} catch (e) {
			console.warn(`Unable to get cache for key "${anonymizeKey(key)}".`, e);
		}

		if (!getFreshValue) {
			return null;
		}

		console.log(`Found no match for key "${anonymizeKey(key)}" in cache. Getting fresh value.`);
		return this.getRefreshed(key, getFreshValue);
	}

	public async set(key: string, value: Contact[]): Promise<void> {
		console.log(`Saving contacts for key "${anonymizeKey(key)}" to cache.`);
		try {
			await this.storage.set(key, value);
		} catch (e) {
			console.warn(`Unable to set cache for key "${anonymizeKey(key)}".`, e);
		}
	}

	public async delete(key: string): Promise<void> {
		console.log(`Removing contacts for key "${anonymizeKey(key)}" from cache.`);
		try {
			await this.storage.delete(key);
		} catch (e) {
			console.warn(`Unable to delete cache for key "${anonymizeKey(key)}".`, e);
		}
	}

	private async getRefreshed(
		key: string,
		getFreshValue: (key: string) => Promise<Contact[] | null>
	): Promise<Contact[] | null> {
		const lastRefreshTime: number = this.lastRefreshTimes.get(key);
		if (lastRefreshTime && new Date().getTime() < lastRefreshTime + MINIMUM_REFRESH_INTERVAL_MS) {
			console.log(
				`Not refreshing for key "${anonymizeKey(key)}", minimum refresh interval is ${MINIMUM_REFRESH_INTERVAL_MS}ms.`
			);
			return null;
		}

		this.lastRefreshTimes.set(key, new Date().getTime());
		const freshValue: Contact[] = await getFreshValue(key);
		if (freshValue) {
			await this.set(key, freshValue);
		}
		return freshValue;
	}
}
