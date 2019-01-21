export interface PhoneNumber {
	label: string | null;
	phoneNumber: string;
}

export interface ContactTemplate {
	name: string | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	company: string | null;
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
