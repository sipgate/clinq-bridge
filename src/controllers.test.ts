import * as httpMocks from "node-mocks-http";

import { IBridgemplementation } from "./bridge-implementation.model";
import { controllerFactory, IControllers } from "./controllers";

const testContacts: any[] = [];

const testImpl: IBridgemplementation = {
	getContacts: () => Promise.resolve(testContacts)
};

const controllers: IControllers = controllerFactory(testImpl);

describe("Controllers", () => {
	it("should handle contacts", async () => {
		const request: httpMocks.MockRequest = httpMocks.createRequest();
		const response: httpMocks.MockResponse = httpMocks.createResponse();

		await controllers.handleContacts(request, response);

		const data: any[] = response._getData();

		expect(data).toBe(testContacts);
	});
});
