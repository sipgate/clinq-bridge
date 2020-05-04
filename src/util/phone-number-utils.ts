import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();

export function convertPhoneNumberToE164(
  phoneNumber: string,
  locale: string
): string {
  const region = locale.replace(/.+_/, "").toUpperCase();

  try {
    const parsedPhoneNumber: libphonenumber.PhoneNumber = phoneUtil.parse(
      phoneNumber,
      region
    );
    return phoneUtil.format(parsedPhoneNumber, PhoneNumberFormat.E164);
  } catch {
    return phoneNumber;
  }
}
