import { Response } from "express";
import { createRequest, createResponse, MockRequest, MockResponse } from "node-mocks-http";

import { Contact, Controller, ServerError } from ".";
import { BridgeRequest } from "./bridge-request.model";
import { PhoneNumberLabel } from "./contact.model";

const contactsMock: Contact[] = [
	{
		id: "abc123",
		name: "Walter Geoffrey",
		firstName: null,
		lastName: null,
		email: "walter@example.com",
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
];

const contactsMinimumMock: Contact[] = [
	{
		id: "123",
		email: null,
		name: null,
		firstName: null,
		lastName: null,
		organization: null,
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

describe("getContacts", () => {
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

describe("getHealth", () => {
	let request: MockRequest<BridgeRequest>;
	let response: MockResponse<Response>;
	let next: jest.Mock;

	beforeEach(() => {
		request = createRequest();
		response = createResponse();
		next = jest.fn();
	});

	it("should implement a default function", async () => {
		const controller: Controller = new Controller({
			getContacts: () => Promise.resolve(contactsMock)
		});

		await controller.getHealth(request, response, next);

		expect(next).not.toBeCalled();
		expect(response.statusCode).toBe(200);
	});

	it("should accept a custom function", async () => {
		const getHealthMock: () => Promise<void> = jest.fn();

		const controller: Controller = new Controller({
			getContacts: () => Promise.resolve(contactsMock),
			getHealth: getHealthMock
		});

		await controller.getHealth(request, response, next);

		expect(getHealthMock).toBeCalled();
		expect(next).not.toBeCalled();
		expect(response.statusCode).toBe(200);
	});

	it("should handle an error", async () => {
		const controller: Controller = new Controller({
			getContacts: () => Promise.reject(),
			getHealth: () => Promise.reject()
		});

		await controller.getHealth(request, response, next);

		expect(next).toBeCalled();
	});
});
