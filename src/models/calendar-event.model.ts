export interface CalendarEventTemplate {
  title: string | null;
  description: string | null;
  start: number | null;
  end: number | null;
}

export interface CalendarEvent extends CalendarEventTemplate {
  id: string;
  eventUrl: string | null;
}
