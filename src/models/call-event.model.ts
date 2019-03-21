import { CallDirection, User } from "./";

export interface CallEvent {
	id: string;
	direction: CallDirection;
	from: string;
	to: string;
	user: User;
	start: number;
	end: number;
}
