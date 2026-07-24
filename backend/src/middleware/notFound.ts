import { type Request, type Response, type NextFunction } from 'express'
import { NotFoundError } from '../errors/AppError'

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundError('Route not found.'))
}
