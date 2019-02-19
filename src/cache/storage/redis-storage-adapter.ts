import * as redis from "redis";
import { StorageAdapter } from "../../models/storage-adapter.model";
import { PromiseRedisClient } from "./promise-redis-client";

const CACHE_TTL: number = 60 * 60 * 24 * 30; // 30 days

export class RedisStorageAdapter<T> implements StorageAdapter<T> {
	private client: PromiseRedisClient;

	constructor(url: string) {
		const client: redis.RedisClient = redis.createClient({
			url
		});
		this.client = new PromiseRedisClient(client);

		console.log(`Initialized Redis storage with URL ${url} .`);
		client.on("error", error => {
			console.warn("Redis error: ", error.message);
		});
	}

	public async get(key: string): Promise<T | null> {
		try {
			return JSON.parse(await this.client.get(key));
		} catch {
			return null;
		}
	}

	public async set(key: string, value: T): Promise<void> {
		await this.client.set(key, JSON.stringify(value), "EX", CACHE_TTL);
	}

	public async delete(key: string): Promise<void> {
		return this.client.del(key);
	}
}
