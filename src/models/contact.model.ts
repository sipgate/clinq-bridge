export interface PhoneNumber {
	label: string | null;
	phoneNumber: string;
}

export interface Contact {
	id: string;
	name: string | null;
	email: string | null;
	company: string | null;
	contactUrl: string | null;
	avatarUrl: string | null;
	phoneNumbers: PhoneNumber[];
}
