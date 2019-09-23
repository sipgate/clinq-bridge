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
	userId: string;
	apiKey: string;
	locale: string;
}

export interface StaffMember {
	id: string;
}
