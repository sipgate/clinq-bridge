import { RedisClient } from "redis";
import { promisify } from "util";

export class PromiseRedisClient {
	public del: (key: string) => Promise<void>;
	public get: (key: string) => Promise<string>;
	public set: (key: string, value: string, mode: string, duration: number) => Promise<string>;

	constructor(client: RedisClient) {
		this.del = promisify(client.del).bind(client);
		this.get = promisify(client.get).bind(client);
		this.set = promisify(client.set).bind(client);
	}
}
