export const calendarEventsSchema = {
  title: "CalendarEvents",
  type: "array",
  items: {
    type: "object",
    properties: {
      fillDefaults: true,
      id: {
        type: "string"
      },
      title: {
        type: ["string", "null"]
      },
      description: {
        type: ["string", "null"]
      },
      eventUrl: {
        type: ["string", "null"]
      },
      start: {
        type: ["number", "null"]
      },
      end: {
        type: ["number", "null"]
      }
    },
    required: ["id", "title", "description", "eventUrl", "start", "end"]
  }
};
