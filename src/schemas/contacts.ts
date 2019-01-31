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
			organization: {
				type: ["string", "null"]
			},
			contactUrl: {
				type: ["string", "null"]
			},
			avatarUrl: {
				type: ["string", "null"]
			},
			name: {
				type: ["string", "null"]
			},
			firstName: {
				type: ["string", "null"]
			},
			lastName: {
				type: ["string", "null"]
			},
			phoneNumbers: {
				type: "array",
				minItems: 1,
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
					required: ["label", "phoneNumber"]
				}
			}
		},
		required: [
			"id",
			"name",
			"firstName",
			"lastName",
			"email",
			"organization",
			"contactUrl",
			"avatarUrl",
			"phoneNumbers"
		]
	}
};
