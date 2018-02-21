import * as express from "express";
import { Server } from "http";

import { authorizationMiddleware, errorHandlerMiddleware } from "./middlewares";
import { Controller, CrmAdapter } from "./models";

const port: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(authorizationMiddleware);

export function start(adapter: CrmAdapter): Server {
	const controller: Controller = new Controller(adapter);

	app.get("/contacts", controller.getContacts);

	app.use(errorHandlerMiddleware);

	return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}

export { CrmAdapter, Contact } from "./models";
