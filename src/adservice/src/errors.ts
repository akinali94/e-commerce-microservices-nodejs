
export class AdServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'AdServiceError';
    Object.setPrototypeOf(this, AdServiceError.prototype);
  }
}


export class InvalidRequestError extends AdServiceError {
  constructor(message: string) {
    super(message, 400, 'INVALID_REQUEST');
    this.name = 'InvalidRequestError';
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}