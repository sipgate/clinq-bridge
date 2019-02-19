import { MockCache, StorageCache } from "../cache";
import { MemoryStorageAdapter, RedisStorageAdapter } from "../cache/storage";
import { ContactCache } from "../models";

const { REDIS_URL, USE_MEMORY_CACHE } = process.env;

export function getContactCache(): ContactCache {
	if (REDIS_URL) {
		return new StorageCache(new RedisStorageAdapter(REDIS_URL));
	}

	if (USE_MEMORY_CACHE) {
		return new StorageCache(new MemoryStorageAdapter());
	}

	return new MockCache();
}
