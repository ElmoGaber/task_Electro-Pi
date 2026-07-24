import { type Request, type Response, type NextFunction } from 'express'
import { AppError } from '../errors/AppError'

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      errors: error.details,
    })
    return
  }

  if (error.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation failed.',
      code: 'MONGOOSE_VALIDATION_ERROR',
    })
    return
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    res.status(401).json({
      message: 'Invalid or expired token.',
      code: 'UNAUTHORIZED',
    })
    return
  }

  console.error(error)
  res.status(500).json({
    message: 'Unexpected server error.',
    code: 'INTERNAL_SERVER_ERROR',
  })
}
