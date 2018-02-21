import { Server } from "http";

import { start } from "./";
import { Contact, CrmAdapter } from "./models";

const testImplementation: CrmAdapter = {
	getContacts(): Promise<Contact[]> {
		return Promise.resolve([
			{
				name: "Max Mustermann",
				phoneNumbers: [
					{
						label: "Mobile",
						phoneNumber: "+4915799912345"
					}
				]
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
