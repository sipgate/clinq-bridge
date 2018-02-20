import * as express from "express";
import { Server } from "http";

import { authorizationMiddleware, errorHandlerMiddleware } from "./middlewares";
import { Controllers, CrmAdapter } from "./models";
import { controllerFactory } from "./util";

const port: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(authorizationMiddleware);

export function start(adapter: CrmAdapter): Server {
	const controllers: Controllers = controllerFactory(adapter);

	app.get("/contacts", controllers.getContacts);

	app.use(errorHandlerMiddleware);

	return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}

export { CrmAdapter, Contact } from "./models";
