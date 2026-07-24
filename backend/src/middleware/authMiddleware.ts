import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError, UnauthorizedError } from '../errors/AppError'

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication required.'))
  }

  const token = authHeader.slice(7)
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    return next(new AppError('JWT secret is not configured.', 500, 'SERVER_CONFIG_ERROR'))
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as { userId: string }
    ;(req as AuthRequest).userId = payload.userId
    return next()
  } catch {
    return next(new UnauthorizedError('Invalid or expired token.'))
  }
}
