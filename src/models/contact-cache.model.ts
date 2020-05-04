import { Contact } from "./contact.model";

type FreshValueUpdater = (key: string) => Promise<Contact[] | null>;

export interface ContactCache {
  get: (
    key: string,
    getFreshValue?: FreshValueUpdater
  ) => Promise<Contact[] | null>;
  set: (key: string, value: Contact[]) => Promise<void>;
  delete: (key: string) => Promise<void>;
}
