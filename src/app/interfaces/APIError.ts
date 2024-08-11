export default class APIError extends Error {
  status: number;
  error: string;

  constructor({
    error,
    status = 500,
  }: {
    name?: string;
    error: string;
    status?: number;
  }) {
    super(error);
    this.name = this.constructor.name;
    this.status = status;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
