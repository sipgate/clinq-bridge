import * as httpMocks from "node-mocks-http";

import { controllerFactory } from "./controllers";
import { BridgeImplementation, ClinqRequest, Controllers } from "./models";

const testContacts: any[] = [];

const testImpl: BridgeImplementation = {
	getContacts: () => Promise.resolve(testContacts)
};

const controllers: Controllers = controllerFactory(testImpl);

describe("Controllers", () => {
	it("should handle contacts", async () => {
		const request: any = httpMocks.createRequest();
		const response: any = httpMocks.createResponse();

		await controllers.handleContacts(request, response);

		const data: any[] = response._getData();

		expect(data).toBe(testContacts);
	});
});
