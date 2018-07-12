export interface PhoneNumber {
	label: string;
	phoneNumber: string;
}

export interface Contact {
	id?: string;
	name: string;
	email?: string;
	company?: string;
	phoneNumbers: PhoneNumber[];
}
