import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import cors = require("cors");
import express = require("express");
import { Server } from "http";
import { errorHandlerMiddleware, extractHeaderMiddleware } from "./middlewares";
import { Adapter, Controller } from "./models";

const port: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(extractHeaderMiddleware);

export function start(adapter: Adapter): Server {
	const controller: Controller = new Controller(adapter);

	app.get("/contacts", controller.getContacts);
	app.post("/contacts", controller.createContact);
	app.put("/contacts/:id", controller.updateContact);
	app.delete("/contacts/:id", controller.deleteContact);
	app.get("/health", controller.getHealth);
	app.get("/oauth2/redirect", controller.oAuth2Redirect);
	app.get("/oauth2/callback", controller.oAuth2Callback);

	app.use(errorHandlerMiddleware);

	return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}

export { Adapter, Config, Contact, ContactTemplate, ContactUpdate, PhoneNumber, ServerError } from "./models";
