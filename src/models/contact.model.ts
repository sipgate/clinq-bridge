export interface PhoneNumber {
	label: string;
	phoneNumber: string;
}

export interface Contact {
	name: string;
	phoneNumbers: PhoneNumber[];
}
