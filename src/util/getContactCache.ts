import { MockCache, StorageCache } from "../cache";
import { MemoryStorageAdapter, RedisStorageAdapter } from "../cache/storage";
import { ContactCache } from "../models";

const { REDIS_URL, USE_MEMORY_CACHE } = process.env;

export function getContactCache(): ContactCache {
	if (REDIS_URL) {
		console.log("Using redis cache");
		return new StorageCache(new RedisStorageAdapter(REDIS_URL));
	}

	if (USE_MEMORY_CACHE) {
		console.log("Using memory cache");
		return new StorageCache(new MemoryStorageAdapter());
	}

	console.log("Using mock cache. Enable Memory (USE_MEMORY_CACHE) or Redis (REDIS_URL) cache via ENV variables.");
	return new MockCache();
}
