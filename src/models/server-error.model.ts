export class ServerError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message || "Unknown Error");
    this.status = status || 500;
  }
}
