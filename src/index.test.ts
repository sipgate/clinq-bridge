import { Server } from "http";

import { start } from "./";
import { IBridgemplementation } from "./bridge-implementation.model";

const testImplementation: IBridgemplementation = {
	getContacts(): Promise<any> {
		return Promise.resolve([]);
	}
};

describe("Library", () => {
	it("should start the server", async () => {
		const server: Server = start(testImplementation);
		expect(server).toBeDefined();
		server.close();
	});
});
