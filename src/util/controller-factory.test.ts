import * as httpMocks from "node-mocks-http";

import {
	ClinqRequest,
	Contact,
	Controllers,
	CrmAdapter
} from "../models";
import { controllerFactory } from "./controller-factory";

const testContacts: Contact[] = [];

const testAdapter: CrmAdapter = {
	getContacts: () => Promise.resolve(testContacts)
};

const controllers: Controllers = controllerFactory(testAdapter);

describe("Controllers", () => {
	it("should handle contacts", async () => {
		const request: httpMocks.MockRequest = httpMocks.createRequest();
		const response: httpMocks.MockResponse = httpMocks.createResponse();

		await controllers.getContacts(request, response);

		const data: Contact[] = response._getData();

		expect(data).toBe(testContacts);
	});
});
