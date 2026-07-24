import { type Response, type NextFunction } from 'express'
import User from '../models/User'
import { AppError, UnauthorizedError } from '../errors/AppError'
import type { AuthRequest } from './authMiddleware'

export const requireRole = (...roles: string[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.userId) {
      return next(new UnauthorizedError('Authentication required.'))
    }

    try {
      const user = await User.findById(req.userId).select('role')
      if (!user || !roles.includes(user.role)) {
        return next(new AppError('Insufficient permissions.', 403, 'FORBIDDEN'))
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
