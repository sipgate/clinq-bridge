import { Request } from "express";
import { Config } from "./config.model";

export interface BridgeRequest extends Request {
  providerConfig?: Config;
}
