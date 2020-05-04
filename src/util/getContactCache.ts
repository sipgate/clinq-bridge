import { StorageCache } from "../cache";
import { MemoryStorageAdapter, RedisStorageAdapter } from "../cache/storage";
import { ContactCache } from "../models";

export function getContactCache(): ContactCache | null {
  const { REDIS_URL, CACHE_DISABLED } = process.env;

  if (CACHE_DISABLED && CACHE_DISABLED === "true") {
    console.log("Caching disabled");
    return null;
  }

  if (REDIS_URL) {
    console.log("Using redis cache");
    return new StorageCache(new RedisStorageAdapter(REDIS_URL));
  }

  console.log("Using memory cache");
  return new StorageCache(new MemoryStorageAdapter());
}
