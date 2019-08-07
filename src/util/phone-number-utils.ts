import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const LANGUAGE: string = "DE";

const phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();
const MIN_PHONENUMBER_E164_LENGTH: number = 10;

export const convertPhoneNumberToE164: (phoneNumber: string) => string = phoneNumber => {
	try {
		const parsedPhoneNumber: libphonenumber.PhoneNumber = phoneUtil.parse(
			prefixInternationalPhoneNumberWithPlus(phoneNumber),
			LANGUAGE
		);
		return phoneUtil.format(parsedPhoneNumber, PhoneNumberFormat.E164);
	} catch {
		return phoneNumber;
	}
};

// DO NOT EXPORT!
const prefixInternationalPhoneNumberWithPlus: (phoneNumber: string) => string = (phoneNumber: string): string =>
	phoneNumber.match(/^[1-9][0-9]{1,2}/) && phoneNumber.length > MIN_PHONENUMBER_E164_LENGTH
		? `+${phoneNumber}`
		: phoneNumber;
