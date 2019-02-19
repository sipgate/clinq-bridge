import * as redis from "redis";
import { Contact, ContactCache } from "../models";
import { anonymizeKey } from "../util/anonymize-key";
import { PromiseRedisClient } from "./promise-redis-client";

const CACHE_TTL: number = 60 * 60 * 24 * 30; // 30 days
const REFRESH_INTERVAL_MS: number = 5 * 60 * 1000; // 5 minutes

export class RedisCache implements ContactCache {
	private client: PromiseRedisClient;
	private lastRefreshTimes: Map<string, number>;

	constructor(url: string) {
		const client: redis.RedisClient = redis.createClient({
			url
		});
		this.client = new PromiseRedisClient(client);

		this.lastRefreshTimes = new Map<string, number>();
		console.log("Initialized Redis cache.");
		client.on("error", error => {
			console.warn("Redis error: ", error.message);
		});
	}

	public async get(
		key: string,
		getFreshValue: (key: string) => Promise<Contact[] | null> = null
	): Promise<Contact[] | null> {
		let value: string;
		try {
			value = await this.client.get(key);
			if (value) {
				console.log(`Found match for key "${anonymizeKey(key)}" in cache.`);

				const lastRefreshTime: number = this.lastRefreshTimes.get(key);
				if (!lastRefreshTime || new Date().getTime() > lastRefreshTime + REFRESH_INTERVAL_MS) {
					this.getRefreshed(key, getFreshValue);
				}

				return JSON.parse(value) as Contact[];
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
			await this.client.set(key, JSON.stringify(value), "EX", CACHE_TTL);
		} catch (e) {
			console.warn(`Unable to set cache for key "${anonymizeKey(key)}".`, e);
		}
	}

	public async delete(key: string): Promise<void> {
		console.log(`Removing contacts for key "${anonymizeKey(key)}" from cache.`);
		try {
			await this.client.del(key);
		} catch (e) {
			console.warn(`Unable to delete cache for key "${anonymizeKey(key)}".`, e);
		}
	}

	private async getRefreshed(
		key: string,
		getFreshValue: (key: string) => Promise<Contact[] | null>
	): Promise<Contact[] | null> {
		const lastRefreshTime: number = this.lastRefreshTimes.get(key);
		if (lastRefreshTime && new Date().getTime() < lastRefreshTime + REFRESH_INTERVAL_MS) {
			console.log(
				`Not refreshing for key "${anonymizeKey(key)}", minimum refresh interval is ${REFRESH_INTERVAL_MS}s.`
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
