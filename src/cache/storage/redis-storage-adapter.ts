import * as redis from "redis";
import { promisify } from "util";
import {
  deflate as nodeDeflate,
  inflate as nodeInflate,
  InputType
} from "zlib";
import { StorageAdapter } from "../../models/storage-adapter.model";
import { PromiseRedisClient } from "./promise-redis-client";

const inflate = promisify<InputType, Buffer>(nodeInflate);
const deflate = promisify<InputType, Buffer>(nodeDeflate);

const CACHE_TTL: number = 60 * 60 * 24 * 30; // 30 days

export class RedisStorageAdapter<T> implements StorageAdapter<T> {
  private client: PromiseRedisClient;

  constructor(url: string) {
    const client: redis.RedisClient = redis.createClient(url,{
      tls:{
        rejectUnauthorized: false,
      }
    });
    this.client = new PromiseRedisClient(client);

    console.log(`Initialized Redis storage with URL ${url}`);
    client.on("error", error => {
      console.warn("Redis error: ", error.message);
    });
  }

  public async get(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if(!value) {
        return null;
      }
      const decompressed = await inflate(Buffer.from(value, "base64"));
      return JSON.parse(decompressed.toString());
    } catch {
      return null;
    }
  }

  public async set(key: string, value: T): Promise<void> {
    const stringified = JSON.stringify(value);
    const compressed = await deflate(stringified);
    await this.client.set(key, compressed.toString("base64"), "EX", CACHE_TTL);
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
