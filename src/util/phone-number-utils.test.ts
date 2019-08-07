import { convertPhoneNumberToE164 } from "./phone-number-utils";

describe("convertPhoneNumberToE164", () => {
	it("converts german local phone numbers", () => {
		expect(convertPhoneNumberToE164("015799912345")).toEqual("+4915799912345");
	});
	it("converts international phone numbers", () => {
		expect(convertPhoneNumberToE164("+48 601 777 257")).toEqual("+48601777257");
	});
	it("returns invalid phone numbers", () => {
		expect(convertPhoneNumberToE164("invalid")).toEqual("invalid");
	});
	it("sanitizes phone numbers", () => {
		expect(convertPhoneNumberToE164("0157-99912345")).toEqual("+4915799912345");
		expect(convertPhoneNumberToE164(" 0157-999 12345")).toEqual("+4915799912345");
		expect(convertPhoneNumberToE164(" 0157-999-12345")).toEqual("+4915799912345");
		expect(convertPhoneNumberToE164("0157/99912345")).toEqual("+4915799912345");
		expect(convertPhoneNumberToE164("01579 (991) 2-3 4 5")).toEqual("+4915799912345");
	});
	// FIXME
	it.skip("converts polish local phone numbers", () => {
		expect(convertPhoneNumberToE164("801 111 111")).toEqual("+48801111111");
	});
});
