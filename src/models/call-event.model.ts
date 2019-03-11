import { CallDirection, CallState, User } from "./";

export interface CallEvent {
	id: string;
	direction: CallDirection;
	from: string;
	to: string;
	fromUser: User | null;
	toUser: User | null;
	state: CallState;
	duration: number;
	start: number;
	end: number;
}
