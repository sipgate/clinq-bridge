import { Server } from "http";

import { start } from ".";
import { Adapter, Contact } from "./models";

const testImplementation: Adapter = {
	getContacts(): Promise<Contact[]> {
		return Promise.resolve([
			{
				company: "Rocket Science Inc.",
				email: "walter@example.com",
				id: "abc123",
				name: "Walter Geoffrey",
				contactUrl: "http://myapp.com/contacts/abc123",
				avatarUrl: "http://myapp.com/avatar/abc123.png",
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
