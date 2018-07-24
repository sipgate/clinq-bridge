// tslint:disable

export const contactsSchema = {
	title: "Contacts",
	type: "array",
	items: {
		type: "object",
		properties: {
			id: {
				type: "string"
			},
			email: {
				type: ["string", "null"]
			},
			company: {
				type: ["string", "null"]
			},
			name: {
				type: "string"
			},
			phoneNumbers: {
				type: "array",
				items: {
					type: "object",
					properties: {
						label: {
							type: ["string", "null"]
						},
						phoneNumber: {
							type: "string"
						}
					},
					required: ["label", "phoneNumber"]
				}
			}
		},
		required: ["id", "email", "company", "name", "phoneNumbers"]
	}
};
