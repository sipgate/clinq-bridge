import * as express from "express";
import { Server } from "http";

import { errorHandlerMiddleware, extractHeaderMiddleware } from "./middlewares";
import { Controller, CrmAdapter } from "./models";

const port: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(extractHeaderMiddleware);

export function start(adapter: CrmAdapter): Server {
	const controller: Controller = new Controller(adapter);

	app.get("/contacts", controller.getContacts);

	app.use(errorHandlerMiddleware);

	return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}

export { CrmAdapter, CrmConfig, Contact } from "./models";
