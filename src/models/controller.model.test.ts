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
		phoneNumbers: [
			{
				label: "Mobile",
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

	it("should handle an error when retrieving contacts", async () => {
		const controller: Controller = new Controller({
			getContacts: () => Promise.reject(ERROR_MESSAGE)
		});

		await controller.getContacts(request, response, next);

		expect(next).toBeCalledWith(ERROR_MESSAGE);
	});

	it("should handle an error when contacts are not valid", async () => {
		const contact: Contact = { ...contactsMock[0] };
		delete contact.name;
		const controller: Controller = new Controller({
			getContacts: () => Promise.resolve([contact])
		});

		await controller.getContacts(request, response, next);

		const error: ServerError = next.mock.calls[0][0];

		expect(next).toBeCalled();
		expect(error.status).toEqual(400);
	});
});
