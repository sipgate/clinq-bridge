import * as getPort from "get-port";
import { Server } from "http";
import { start } from ".";
import { Adapter } from "./models";

const testAdapter: Adapter = {};

describe("Framework", () => {
	it("should start the server", async () => {
		const port: number = await getPort();
		console.log(`Testing server on port ${port}`);
		const server: Server = start(testAdapter, port);
		expect(server).toBeDefined();
		server.close();
	});
});
