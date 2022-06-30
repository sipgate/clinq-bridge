export enum PhoneNumberLabel {
  WORK = "WORK",
  MOBILE = "MOBILE",
  HOME = "HOME",
  HOMEFAX = "HOMEFAX",
  WORKFAX = "WORKFAX",
  OTHERFAX = "OTHERFAX",
  PAGER = "PAGER",
  WORKMOBILE = "WORKMOBILE",
  WORKPAGER = "WORKPAGER",
  MAIN = "MAIN",
  GOOGLEVOICE = "GOOGLEVOICE",
  OTHER = "OTHER",
  DIRECTDIAL = "DIRECTDIAL",
}

export interface PhoneNumber {
  label: PhoneNumberLabel;
  phoneNumber: string;
}

export interface ContactTemplate {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  organization: string | null;
  phoneNumbers: PhoneNumber[];
}

export interface TimeoutResult {
  status: 408;
  description: string;
}
export interface Contact extends ContactTemplate {
  id: string;
  contactUrl: string | null;
  avatarUrl: string | null;
  readonly?: boolean;
}

export interface ContactUpdate extends ContactTemplate {
  id: string;
}
