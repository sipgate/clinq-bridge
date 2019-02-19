interface EcmaSizes {
	[key: string]: number;
}

const ECMA_SIZES: EcmaSizes = {
	STRING: 2,
	BOOLEAN: 4,
	NUMBER: 8
};

// tslint:disable-next-line no-any
function sizeOfObject(object: any): number {
	if (object === null) {
		return 0;
	}

	let bytes: number = 0;
	for (const key in object) {
		if (!Object.hasOwnProperty.call(object, key)) {
			continue;
		}

		bytes += sizeof(key);
		try {
			bytes += sizeof(object[key]);
		} catch (ex) {
			if (ex instanceof RangeError) {
				bytes = 0;
			}
		}
	}

	return bytes;
}

// tslint:disable-next-line no-any
export default function sizeof(object: any): number {
	switch (typeof object) {
		case "string":
			return object.length * ECMA_SIZES.STRING;
		case "boolean":
			return ECMA_SIZES.BOOLEAN;
		case "number":
			return ECMA_SIZES.NUMBER;
		case "object":
			return sizeOfObject(object);
		default:
			return 0;
	}
}
