import * as express from "express";
import { Server } from "http";

import { controllerFactory } from "./controllers";
import { authorizationMiddleware, errorHandlerMiddleware } from "./middlewares";
import { BridgeImplementation, Controllers } from "./models";

const port: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(authorizationMiddleware);

export function start(impl: BridgeImplementation): Server {
	const controllers: Controllers = controllerFactory(impl);

	app.get("/contacts", controllers.handleContacts);

	app.use(errorHandlerMiddleware);

	return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}

export { BridgeImplementation } from "./models";
