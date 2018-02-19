import { Server } from "http";

import { start } from "./";
import { BridgeImplementation, Contact } from "./models";

const testImplementation: BridgeImplementation = {
	getContacts(): Promise<Contact[]> {
		return Promise.resolve([
			{
				name: "Max Mustermann",
				phoneNumbers: ["+49220123456789"]
			}
		]);
	}
};

describe("Library", () => {
	it("should start the server", async () => {
		const server: Server = start(testImplementation);
		expect(server).toBeDefined();
		server.close();
	});
});
