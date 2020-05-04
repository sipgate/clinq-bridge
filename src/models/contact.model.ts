export enum PhoneNumberLabel {
  WORK = "WORK",
  MOBILE = "MOBILE",
  HOME = "HOME"
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

export interface Contact extends ContactTemplate {
  id: string;
  contactUrl: string | null;
  avatarUrl: string | null;
}

export interface ContactUpdate extends ContactTemplate {
  id: string;
}
