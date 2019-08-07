import { Request } from "express";
import { CallEvent, Config, Contact, ContactTemplate, ContactUpdate } from ".";

export interface Adapter {
	getContacts?: (config: Config) => Promise<Contact[]>;
	createContact?: (config: Config, contact: ContactTemplate) => Promise<Contact>;
	updateContact?: (config: Config, id: string, contact: ContactUpdate) => Promise<Contact>;
	deleteContact?: (config: Config, id: string) => Promise<void>;
	handleCallEvent?: (config: Config, event: CallEvent) => Promise<void>;
	handleConnectedEvent?: (config: Config) => Promise<void>;
	getHealth?: () => Promise<void>;
	getOAuth2RedirectUrl?: () => Promise<string>;
	handleOAuth2Callback?: (req: Request) => Promise<{ apiKey: string; apiUrl: string }>;
}
