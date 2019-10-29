export const calendarEventsSchema = {
	title: "CalendarEvents",
	type: "array",
	items: {
		type: "object",
		properties: {
			fillDefaults: true,
			id: {
				type: "string"
			}
		},
		required: ["id"]
	}
};
