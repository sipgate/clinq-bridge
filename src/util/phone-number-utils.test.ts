import { convertPhoneNumberToE164 } from "./phone-number-utils";

describe("convertPhoneNumberToE164", () => {
  it("converts local phone numbers", () => {
    expect(convertPhoneNumberToE164("015799912345", "de_DE")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164("0495 46.68.28", "fr_BE")).toEqual(
      "+32495466828"
    );
    expect(convertPhoneNumberToE164("26954490", "fr_LU")).toEqual(
      "+35226954490"
    );
    expect(convertPhoneNumberToE164("08-663 88 95 ", "se_SE")).toEqual(
      "+4686638895"
    );
    expect(convertPhoneNumberToE164("801 111 111", "pl_PL")).toEqual(
      "+48801111111"
    );
    expect(convertPhoneNumberToE164("913 693 210", "es_ES")).toEqual(
      "+34913693210"
    );
    expect(convertPhoneNumberToE164("415 (555) SHOE", "en_US")).toEqual(
      "+14155557463"
    );
    expect(convertPhoneNumberToE164("(212) 366-1182", "en_US")).toEqual(
      "+12123661182"
    );
  });
  it("converts international phone numbers", () => {
    expect(convertPhoneNumberToE164("+48 601 777 257", "de_DE")).toEqual(
      "+48601777257"
    );
    expect(convertPhoneNumberToE164("+49 1579 99 12345", "fr_LU")).toEqual(
      "+4915799912345"
    );
  });
  it("sanitizes phone numbers", () => {
    expect(convertPhoneNumberToE164("0157-99912345", "de_DE")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164(" 0157-999 12345", "de_DE")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164(" 0157-999-12345", "de_DE")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164("0157/99912345", "de_DE")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164("01579 (991) 2-3 4 5", "de_DE")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164("+49 (1579) 991/2-3 4 5", "de_DE")).toEqual(
      "+4915799912345"
    );
  });
  it("recovers invalid locale", () => {
    expect(convertPhoneNumberToE164("015799912345", "de_de")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164("015799912345", "de")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164("015799912345", "De")).toEqual(
      "+4915799912345"
    );
    expect(convertPhoneNumberToE164("015799912345", "DE")).toEqual(
      "+4915799912345"
    );
  });
  it("returns initial phone number on invalid locale", () => {
    expect(convertPhoneNumberToE164("801 111 111", "")).toEqual("801 111 111");
  });
  it("returns initial phone number on invalid phone number", () => {
    expect(convertPhoneNumberToE164("invalid", "de_DE")).toEqual("invalid");
  });
});
