import { type Request, type Response, type NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/AppError'

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  return next(
    new ValidationError(
      'Validation failed.',
      errors.array().map((error) => ({
        field: (error as { path: string }).path,
        message: (error as { msg: string }).msg,
      })),
    ),
  )
}
