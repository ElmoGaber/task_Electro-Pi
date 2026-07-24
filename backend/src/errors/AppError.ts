export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details: unknown

  constructor(
    message: string,
    statusCode: number,
    code: string = 'APP_ERROR',
    details: unknown = null,
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed.', details: unknown[] = []) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized.') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found.') {
    super(message, 404, 'NOT_FOUND')
  }
}
