import * as httpMocks from "node-mocks-http";

import { controllerFactory } from "./controllers";
import {
	BridgeImplementation,
	ClinqRequest,
	Contact,
	Controllers
} from "./models";

const testContacts: Contact[] = [];

const testImpl: BridgeImplementation = {
	getContacts: () => Promise.resolve(testContacts)
};

const controllers: Controllers = controllerFactory(testImpl);

describe("Controllers", () => {
	it("should handle contacts", async () => {
		const request: any = httpMocks.createRequest();
		const response: httpMocks.MockResponse = httpMocks.createResponse();

		await controllers.handleContacts(request, response);

		const data: Contact[] = response._getData();

		expect(data).toBe(testContacts);
	});
});
