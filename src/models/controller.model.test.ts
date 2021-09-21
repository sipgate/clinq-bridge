import { Response } from "express";
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from "node-mocks-http";
import { CalendarEvent, Contact, Controller } from ".";
import { StorageCache } from "../cache";
import { MemoryStorageAdapter } from "../cache/storage";
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
        phoneNumber: "+4915799912345",
      },
    ],
  },
];

const calendarEventMock: CalendarEvent = {
  id: "abc123",
  title: "My Event",
  description: "Awesome event",
  eventUrl: "https://wwww.google.com",
  start: 123456789,
  end: 123456789,
};

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
        label: PhoneNumberLabel.WORK,
        phoneNumber: "+4915799912345",
      },
    ],
  },
];

const ERROR_MESSAGE: string = "Error!";

describe("getContacts", () => {
  let request: MockRequest<BridgeRequest>;
  let response: MockResponse<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    request = createRequest({
      providerConfig: {
        apiKey: "a1b2c3",
        apiUrl: "http://example.com",
        locale: "de_DE",
      },
    });
    response = createResponse();
    next = jest.fn();
  });

  it("should handle contacts", async () => {
    const controller: Controller = new Controller(
      {
        getContacts: () => Promise.resolve(contactsMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getContacts(request, response, next);

    const data: Contact[] = response._getData();

    expect(next).not.toBeCalled();
    expect(data).toEqual(contactsMock);
  });

  it("should handle contacts with minimum fields", async () => {
    const controller: Controller = new Controller(
      {
        getContacts: () => Promise.resolve(contactsMinimumMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getContacts(request, response, next);

    const data: Contact[] = response._getData();

    expect(next).not.toBeCalled();
    expect(data).toEqual(contactsMinimumMock);
  });

  it("should handle invalid contacts with missing fields", async () => {
    const contactsBrokenMock: Contact[] = [...contactsMinimumMock];
    delete contactsBrokenMock[0].name;
    const controller: Controller = new Controller(
      {
        getContacts: () => Promise.resolve(contactsBrokenMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getContacts(request, response, next);

    const data: Contact[] = response._getData();

    expect(next).not.toBeCalled();
    expect(data).toEqual([]);
  });

  it("should handle an error when retrieving contacts", async () => {
    const controller: Controller = new Controller(
      {
        getContacts: () => Promise.reject(ERROR_MESSAGE),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getContacts(request, response, next);

    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});

describe("getCalendarEvents", () => {
  let request: MockRequest<BridgeRequest>;
  let response: MockResponse<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    request = createRequest({
      providerConfig: {
        apiKey: "a1b2c3",
        apiUrl: "http://example.com",
        locale: "de_DE",
      },
    });
    response = createResponse();
    next = jest.fn();
  });

  it("should handle calendar events", async () => {
    const controller: Controller = new Controller(
      {
        getCalendarEvents: () => Promise.resolve([calendarEventMock]),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getCalendarEvents(request, response, next);

    const data: CalendarEvent[] = response._getData();

    expect(next).not.toBeCalled();
    expect(data).toEqual([calendarEventMock]);
  });

  it("should handle invalid calendar events", async () => {
    const calendarEventsBrokenMock: CalendarEvent[] = [
      { ...calendarEventMock },
    ];
    delete calendarEventsBrokenMock[0].id;
    const controller: Controller = new Controller(
      {
        getCalendarEvents: () => Promise.resolve(calendarEventsBrokenMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getCalendarEvents(request, response, next);

    expect(next).toBeCalled();
  });

  it("should handle an error when retrieving calendar events", async () => {
    const controller: Controller = new Controller(
      {
        getCalendarEvents: () => Promise.reject(ERROR_MESSAGE),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getCalendarEvents(request, response, next);

    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});

describe("createCalendarEvent", () => {
  let request: MockRequest<BridgeRequest>;
  let response: MockResponse<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    request = createRequest({
      providerConfig: {
        apiKey: "a1b2c3",
        apiUrl: "http://example.com",
        locale: "de_DE",
      },
    });
    response = createResponse();
    next = jest.fn();
  });

  it("should create calendar events", async () => {
    const controller: Controller = new Controller(
      {
        createCalendarEvent: () => Promise.resolve(calendarEventMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.createCalendarEvent(request, response, next);

    const data: CalendarEvent = response._getData();

    expect(next).not.toBeCalled();
    expect(data).toEqual(calendarEventMock);
  });

  it("should handle invalid calendar events", async () => {
    const calendarEventBrokenMock: CalendarEvent = { ...calendarEventMock };
    delete calendarEventBrokenMock.id;
    const controller: Controller = new Controller(
      {
        createCalendarEvent: () => Promise.resolve(calendarEventBrokenMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.createCalendarEvent(request, response, next);

    expect(next).toBeCalled();
  });

  it("should handle an error when creating calendar events", async () => {
    const controller: Controller = new Controller(
      {
        createCalendarEvent: () => Promise.reject(ERROR_MESSAGE),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.createCalendarEvent(request, response, next);

    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});

describe("updateCalendarEvent", () => {
  let request: MockRequest<BridgeRequest>;
  let response: MockResponse<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    request = createRequest({
      providerConfig: {
        apiKey: "a1b2c3",
        apiUrl: "http://example.com",
        locale: "de_DE",
      },
    });
    response = createResponse();
    next = jest.fn();
  });

  it("should update calendar events", async () => {
    const controller: Controller = new Controller(
      {
        updateCalendarEvent: () => Promise.resolve(calendarEventMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.updateCalendarEvent(request, response, next);

    const data: CalendarEvent = response._getData();

    expect(next).not.toBeCalled();
    expect(data).toEqual(calendarEventMock);
  });

  it("should handle invalid calendar events", async () => {
    const calendarEventBrokenMock: CalendarEvent = { ...calendarEventMock };
    delete calendarEventBrokenMock.id;
    const controller: Controller = new Controller(
      {
        updateCalendarEvent: () => Promise.resolve(calendarEventBrokenMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.updateCalendarEvent(request, response, next);

    expect(next).toBeCalled();
  });

  it("should handle an error when updating calendar events", async () => {
    const controller: Controller = new Controller(
      {
        updateCalendarEvent: () => Promise.reject(ERROR_MESSAGE),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.updateCalendarEvent(request, response, next);

    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});

describe("deleteCalendarEvent", () => {
  let request: MockRequest<BridgeRequest>;
  let response: MockResponse<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    request = createRequest({
      providerConfig: {
        apiKey: "a1b2c3",
        apiUrl: "http://example.com",
        locale: "de_DE",
      },
    });
    response = createResponse();
    next = jest.fn();
  });

  it("should delete calendar events", async () => {
    const controller: Controller = new Controller(
      {
        deleteCalendarEvent: () => Promise.resolve(),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.deleteCalendarEvent(request, response, next);

    expect(next).not.toBeCalled();
    expect(response._getStatusCode()).toEqual(200);
  });

  it("should handle an error when deleting calendar events", async () => {
    const controller: Controller = new Controller(
      {
        deleteCalendarEvent: () => Promise.reject(ERROR_MESSAGE),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.deleteCalendarEvent(request, response, next);

    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});

describe("getOAuth2RedirectUrl", () => {
  let request: MockRequest<BridgeRequest>;
  let response: MockResponse<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    request = createRequest();
    response = createResponse();
    next = jest.fn();
  });

  it("should handle OAuth2 callback", async () => {
    const mockHandleOAuth2Callback = jest.fn();

    const controller: Controller = new Controller(
      {
        handleOAuth2Callback: mockHandleOAuth2Callback,
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.oAuth2Callback(request, response);

    expect(mockHandleOAuth2Callback).toBeCalled();
    expect(next).not.toBeCalled();
  });

  it("should handle a custom redirect url", async () => {
    const mockRedirectUrl = "https://www.clinq.app/settings/integrations/oauth/callback?name=UNKNOWN&key=key&url=URL";
    const mockRedirect = jest.fn();
    const mockHandleOAuth2Callback = jest.fn();
    mockHandleOAuth2Callback.mockReturnValue({
      apiKey: "key",
      apiUrl: "URL",
      redirectUrl: "redirectURL",
    });

    const controller: Controller = new Controller(
      {
        handleOAuth2Callback: mockHandleOAuth2Callback,
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    request = createRequest({
      query: {
        redirectUrl: mockRedirectUrl,
      },
    });
    response = { redirect: mockRedirect } as any;
    await controller.oAuth2Callback(request, response);

    expect(mockHandleOAuth2Callback).toBeCalled();
    expect(mockRedirect).toBeCalledWith(mockRedirectUrl);
    expect(next).not.toBeCalled();
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
    const controller: Controller = new Controller(
      {
        getContacts: () => Promise.resolve(contactsMock),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getHealth(request, response, next);

    expect(next).not.toBeCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should accept a custom function", async () => {
    const getHealthMock: () => Promise<void> = jest.fn();

    const controller: Controller = new Controller(
      {
        getContacts: () => Promise.resolve(contactsMock),
        getHealth: getHealthMock,
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getHealth(request, response, next);

    expect(getHealthMock).toBeCalled();
    expect(next).not.toBeCalled();
    expect(response.statusCode).toBe(200);
  });

  it("should handle an error", async () => {
    const controller: Controller = new Controller(
      {
        getContacts: () => Promise.reject(),
        getHealth: () => Promise.reject(new Error("Error")),
      },
      new StorageCache(new MemoryStorageAdapter())
    );

    await controller.getHealth(request, response, next);

    expect(next).toBeCalled();
  });
});
