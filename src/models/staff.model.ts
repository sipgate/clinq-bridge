import { Contact } from "./contact.model";

export interface ContactHook {
	userId: string;
	userLocale: string;
	event: HookEvent;
	contact: Contact;
}

export enum HookEvent {
	CREATE = "create",
	UPDATE = "update",
	DELETE = "delete"
}

export interface ApiUser {
	apiKey: string;
	locale: string;
}
