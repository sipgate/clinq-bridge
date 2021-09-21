import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import { Server } from "http";
import { errorHandlerMiddleware, extractHeaderMiddleware } from "./middlewares";
import { Adapter, Controller } from "./models";
import { getContactCache } from "./util/getContactCache";

const settingsPort: number = Number(process.env.PORT) || 8080;

const app: express.Application = express();

app.use(compression());
app.use(cors({ credentials: true, origin: true, allowedHeaders: "x-clinq-redirectUrl" }));
app.use(bodyParser.json());
app.use(extractHeaderMiddleware);

export function start(adapter: Adapter, port: number = settingsPort): Server {
  const cache = getContactCache();

  const controller: Controller = new Controller(adapter, cache);

  app.get("/contacts", controller.getContacts);
  app.post("/contacts", controller.createContact);
  app.put("/contacts/:id", controller.updateContact);
  app.delete("/contacts/:id", controller.deleteContact);
  app.get("/calendar", controller.getCalendarEvents);
  app.post("/calendar", controller.createCalendarEvent);
  app.put("/calendar/:id", controller.updateCalendarEvent);
  app.delete("/calendar/:id", controller.deleteCalendarEvent);
  app.post("/events/calls", controller.handleCallEvent);
  app.post("/events/connected", controller.handleConnectedEvent);
  app.get("/health", controller.getHealth);
  app.get("/oauth2/redirect", controller.oAuth2Redirect);
  app.get("/oauth2/callback", controller.oAuth2Callback);

  app.use(errorHandlerMiddleware);

  return app.listen(port, () => console.log(`Listening on port ${port}`)); // tslint:disable-line
}

export * from "./models";
