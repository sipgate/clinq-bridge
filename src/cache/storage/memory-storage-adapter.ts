import * as LRU from "lru-cache";
import { StorageAdapter } from "../../models/storage-adapter.model";
import sizeof from "../../util/sizeof";

const CACHE_TTL_MS: number = 60 * 60 * 24 * 30 * 1000; // 30 days
const MAX_CACHE_SIZE_BYTES: number = 400 * 1024 * 1024; // 400mb

export class MemoryStorageAdapter<T> implements StorageAdapter<T> {
	private cache: LRU.Cache<string, T>;

	constructor() {
		this.cache = new LRU({
			max: MAX_CACHE_SIZE_BYTES,
			maxAge: CACHE_TTL_MS,
			length: sizeof
		});
		console.log("Initialized Memory storage");
	}

	public async get(key: string): Promise<T | null> {
		const cached = this.cache.get(key);
		return cached ? cached : null;
	}

	public async set(key: string, value: T): Promise<void> {
		await this.cache.set(key, value);
	}

	public async delete(key: string): Promise<void> {
		return this.cache.del(key);
	}
}
