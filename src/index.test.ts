import * as getPort from "get-port";
import { Server } from "http";
import { start } from ".";
import { Adapter, Contact, PhoneNumberLabel } from "./models";

const testImplementation: Adapter = {
	getContacts(): Promise<Contact[]> {
		return Promise.resolve([
			{
				email: "walter@example.com",
				id: "abc123",
				name: "Walter Geoffrey",
				firstName: null,
				lastName: null,
				organization: "Rocket Science Inc.",
				contactUrl: "http://myapp.com/contacts/abc123",
				avatarUrl: "http://myapp.com/avatar/abc123.png",
				phoneNumbers: [
					{
						label: PhoneNumberLabel.MOBILE,
						phoneNumber: "+4915799912345"
					}
				]
			}
		]);
	}
};

describe("Framework", () => {
	it("should start the server", async () => {
		const randomFreePort: number = await getPort();
		console.log("Testing server on port " + randomFreePort);
		const server: Server = start(testImplementation, randomFreePort);
		expect(server).toBeDefined();
		server.close();
	});
});
