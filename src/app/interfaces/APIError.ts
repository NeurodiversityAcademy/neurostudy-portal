export default class APIError extends Error {
  status: number;

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

    Object.defineProperty(this, 'message', {
      value: error,
      enumerable: true,
      writable: true,
      configurable: true,
    });

    Error.captureStackTrace(this, this.constructor);
  }
}
