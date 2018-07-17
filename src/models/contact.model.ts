export interface PhoneNumber {
	label: string | null;
	phoneNumber: string;
}

export interface Contact {
	id: string;
	name: string;
	email: string | null;
	company: string | null;
	phoneNumbers: PhoneNumber[];
}
