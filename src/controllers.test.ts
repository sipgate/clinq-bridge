import * as httpMocks from "node-mocks-http";

import controllerFactory from "./controllers";

const testContacts = [];

const testImpl = {
	getContacts: () => Promise.resolve(testContacts)
};

const controllers = controllerFactory(testImpl);

describe("Controllers", () => {
	it("should handle contacts", async () => {
		const request = httpMocks.createRequest();
		const response = httpMocks.createResponse();

		await controllers.handleContacts(request, response);

		const data = response._getData();

		expect(data).toBe(testContacts);
	});
});
