import * as errorhandler from "errorhandler";
import * as express from "express";

import { IBridgemplementation } from "./bridge-implementation.model";
import { controllerFactory, IControllers } from "./controllers";

const port: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(errorhandler());

export function start(impl: IBridgemplementation): void {
	const controllers: IControllers = controllerFactory(impl);

	app.get("/contacts", controllers.handleContacts);

	app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}
