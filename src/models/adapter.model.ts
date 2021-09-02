import { Request } from "express";
import {
  CalendarEvent,
  CalendarEventTemplate,
  CalendarFilterOptions,
  CallEvent,
  Config,
  Contact,
  ContactTemplate,
  ContactUpdate,
  OAuthURLConfig,
} from ".";

export interface Adapter {
  getContacts?: (config: Config) => Promise<Contact[]>;
  createContact?: (
    config: Config,
    contact: ContactTemplate
  ) => Promise<Contact>;
  updateContact?: (
    config: Config,
    id: string,
    contact: ContactUpdate
  ) => Promise<Contact>;
  deleteContact?: (config: Config, id: string) => Promise<void>;
  getCalendarEvents?: (
    config: Config,
    options?: CalendarFilterOptions | null
  ) => Promise<CalendarEvent[]>;
  createCalendarEvent?: (
    config: Config,
    event: CalendarEventTemplate
  ) => Promise<CalendarEvent>;
  updateCalendarEvent?: (
    config: Config,
    id: string,
    event: CalendarEventTemplate
  ) => Promise<CalendarEvent>;
  deleteCalendarEvent?: (config: Config, id: string) => Promise<void>;
  handleCallEvent?: (config: Config, event: CallEvent) => Promise<void>;
  handleConnectedEvent?: (config: Config) => Promise<void>;
  getHealth?: () => Promise<void>;
  getOAuth2RedirectUrl?: (urlConfig?: OAuthURLConfig) => Promise<string>;
  handleOAuth2Callback?: (
    req: Request
  ) => Promise<{ apiKey: string; apiUrl: string }>;
}
