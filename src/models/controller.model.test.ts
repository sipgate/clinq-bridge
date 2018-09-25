import { Response } from "express";
import { createRequest, createResponse, MockRequest, MockResponse } from "node-mocks-http";

import { Contact, Controller, ServerError } from ".";
import { BridgeRequest } from "./bridge-request.model";

const contactsMock: Contact[] = [
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
];

const contactsMinimumMock: Contact[] = [
	{
		id: "123",
		email: null,
		company: null,
		name: null,
		contactUrl: null,
		avatarUrl: null,
		phoneNumbers: [
			{
				label: null,
				phoneNumber: "+4915799912345"
			}
		]
	}
];

const ERROR_MESSAGE: string = "Error!";

describe("Controller", () => {
	let request: MockRequest<BridgeRequest>;
	let response: MockResponse<Response>;
	let next: jest.Mock;

	beforeEach(() => {
		request = createRequest();
		response = createResponse();
		next = jest.fn();
	});

	it("should handle contacts", async () => {
		const controller: Controller = new Controller({
			getContacts: () => Promise.resolve(contactsMock)
		});

		await controller.getContacts(request, response, next);

		const data: Contact[] = response._getData();

		expect(next).not.toBeCalled();
		expect(data).toBe(contactsMock);
	});

	it("should handle contacts with minimum fields", async () => {
		const controller: Controller = new Controller({
			getContacts: () => Promise.resolve(contactsMinimumMock)
		});

		await controller.getContacts(request, response, next);

		const data: Contact[] = response._getData();

		expect(next).not.toBeCalled();
		expect(data).toBe(contactsMinimumMock);
	});

	it("should handle invalid contacts with missing fields", async () => {
		const contactsBrokenMock: Contact[] = [...contactsMinimumMock];
		delete contactsBrokenMock[0].name;
		const controller: Controller = new Controller({
			getContacts: () => Promise.resolve(contactsBrokenMock)
		});

		await controller.getContacts(request, response, next);

		const error: ServerError = next.mock.calls[0][0];

		expect(next).toBeCalled();
		expect(error.status).toEqual(400);
	});

	it("should handle an error when retrieving contacts", async () => {
		const controller: Controller = new Controller({
			getContacts: () => Promise.reject(ERROR_MESSAGE)
		});

		await controller.getContacts(request, response, next);

		expect(next).toBeCalledWith(ERROR_MESSAGE);
	});
});
