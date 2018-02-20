import * as httpMocks from "node-mocks-http";

import { Contact, Controllers, CrmAdapter } from "../models";
import { controllerFactory } from "./controller-factory";

const contactsMock: Contact[] = [];

const ERROR_MESSAGE: string = "Error!";

const adapterMock: CrmAdapter = {
	getContacts: () => Promise.resolve(contactsMock)
};

const errorAdapterMock: CrmAdapter = {
	getContacts: () => Promise.reject(ERROR_MESSAGE)
};

describe("Controllers", () => {
	let nextMock: jest.Mock;

	beforeEach(() => {
		nextMock = jest.fn();
	});

	it("should handle contacts", async () => {
		const controllers: Controllers = controllerFactory(adapterMock);
		const requestMock: httpMocks.MockRequest = httpMocks.createRequest();
		const responseMock: httpMocks.MockResponse = httpMocks.createResponse();

		await controllers.getContacts(requestMock, responseMock, nextMock);

		const data: Contact[] = responseMock._getData();

		expect(nextMock).not.toBeCalled();
		expect(data).toBe(contactsMock);
	});

	it("should handle an error when retrieving contacts", async () => {
		const controllers: Controllers = controllerFactory(errorAdapterMock);
		const requestMock: httpMocks.MockRequest = httpMocks.createRequest();
		const responseMock: httpMocks.MockResponse = httpMocks.createResponse();

		await controllers.getContacts(requestMock, responseMock, nextMock);

		expect(nextMock).toBeCalledWith(ERROR_MESSAGE);
	});
});
