// tslint:disable

export default {
	title: "Contacts",
	type: "array",
	items: {
		type: "object",
		properties: {
			name: {
				type: "string"
			},
			phoneNumbers: {
				type: "array",
				items: {
					type: "object",
					properties: {
						label: {
							type: "string"
						},
						phoneNumber: {
							type: "string"
						}
					},
					required: ["phoneNumber"]
				}
			}
		},
		required: ["name", "phoneNumbers"]
	}
};
