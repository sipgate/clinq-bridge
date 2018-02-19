import errorHandler from "errorhandler";
import * as express from "express";

import controllerFactory from "./controllers";

const port = process.env.PORT || 8080;

const app: express.Application = express();

app.use(errorHandler());

export function start(impl) {
	const controllers = controllerFactory(impl);

	app.get("/contacts", controllers.handleContacts);

	app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}
