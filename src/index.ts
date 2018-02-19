import * as errorhandler from "errorhandler";
import * as express from "express";
import { Server } from "http";

import { controllerFactory, IControllers } from "./controllers";
import { authorizationMiddleware } from "./middlewares";
import { IBridgeImplementation } from "./models";

const port: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(errorhandler());
app.use(authorizationMiddleware);

export function start(impl: IBridgeImplementation): Server {
	const controllers: IControllers = controllerFactory(impl);

	app.get("/contacts", controllers.handleContacts);

	return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}
