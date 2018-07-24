import { ServerError } from "../models";

export function unauthorized(): void {
	throw new ServerError(401, "Unauthorized");
}
