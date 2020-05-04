import { CallDirection, Channel, User } from "./";

export interface CallEvent {
  id: string;
  channel: Channel;
  direction: CallDirection;
  from: string;
  to: string;
  user: User;
  start: number;
  end: number;
}
