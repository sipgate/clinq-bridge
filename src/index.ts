import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import cors = require("cors");
import express = require("express");
import { Server } from "http";
import { errorHandlerMiddleware, extractHeaderMiddleware } from "./middlewares";
import { Adapter, ContactCache, Controller } from "./models";
import { getContactCache } from "./util/getContactCache";

const settingsPort: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(extractHeaderMiddleware);

export function start(adapter: Adapter, port: number = settingsPort): Server {
	const cache: ContactCache = getContactCache();

	const controller: Controller = new Controller(adapter, cache);

	app.get("/contacts", controller.getContacts);
	app.post("/contacts", controller.createContact);
	app.put("/contacts/:id", controller.updateContact);
	app.delete("/contacts/:id", controller.deleteContact);
	app.post("/events/calls", controller.handleCallEvent);
	app.get("/health", controller.getHealth);
	app.get("/oauth2/redirect", controller.oAuth2Redirect);
	app.get("/oauth2/callback", controller.oAuth2Callback);

	app.use(errorHandlerMiddleware);

	return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}

export {
	Adapter,
	CallDirection,
	CallEvent,
	Config,
	Contact,
	ContactTemplate,
	ContactUpdate,
	PhoneNumber,
	PhoneNumberLabel,
	ServerError,
	User
} from "./models";
