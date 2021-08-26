import { NextFunction, Request, Response } from "express";
import { ServerError } from "../models";

export function errorHandlerMiddleware(
  error: Error | ServerError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof ServerError) {
    res.status(error.status).send(error.message);
    return;
  }

  res.status(500).send(error.message);
}
