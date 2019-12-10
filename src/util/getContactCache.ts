import { StorageCache } from "../cache";
import { MemoryStorageAdapter, RedisStorageAdapter } from "../cache/storage";
import { ContactCache } from "../models";

export function getContactCache(): ContactCache {
	const { REDIS_URL } = process.env;
	if (REDIS_URL) {
		console.log("Using redis cache");
		return new StorageCache(new RedisStorageAdapter(REDIS_URL));
	}

	console.log("Using memory cache");
	return new StorageCache(new MemoryStorageAdapter());
}
