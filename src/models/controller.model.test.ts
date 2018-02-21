import {
	createRequest,
	createResponse,
	MockRequest,
	MockResponse
} from "node-mocks-http";

import { Contact, Controller, CrmAdapter } from ".";

const contactsMock: Contact[] = [
	{
		name: "Max Mustermann",
		phoneNumbers: [
			{
				label: "Mobile",
				phoneNumber: "+4912345678910"
			}
		]
	}
];

const ERROR_MESSAGE: string = "Error!";

const adapterMock: CrmAdapter = {
	getContacts: () => Promise.resolve(contactsMock)
};

const errorAdapterMock: CrmAdapter = {
	getContacts: () => Promise.reject(ERROR_MESSAGE)
};

describe("Controller", () => {
	let nextMock: jest.Mock;

	beforeEach(() => {
		nextMock = jest.fn();
	});

	it("should handle contacts", async () => {
		const controller: Controller = new Controller(adapterMock);
		const requestMock: MockRequest = createRequest();
		const responseMock: MockResponse = createResponse();

		await controller.getContacts(requestMock, responseMock, nextMock);

		const data: Contact[] = responseMock._getData();

		expect(nextMock).not.toBeCalled();
		expect(data).toBe(contactsMock);
	});

	it("should handle an error when retrieving contacts", async () => {
		const controller: Controller = new Controller(errorAdapterMock);
		const requestMock: MockRequest = createRequest();
		const responseMock: MockResponse = createResponse();

		await controller.getContacts(requestMock, responseMock, nextMock);

		expect(nextMock).toBeCalledWith(ERROR_MESSAGE);
	});
});
