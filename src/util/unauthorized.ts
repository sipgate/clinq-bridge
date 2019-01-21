import { ServerError } from "../models";

export function unauthorized(): ServerError {
	return new ServerError(401, "Unauthorized");
}
