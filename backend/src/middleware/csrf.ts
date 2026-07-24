import { type Request, type Response, type NextFunction } from 'express'
import crypto from 'crypto'
import { AppError } from '../errors/AppError'

const CSRF_COOKIE = 'csrf-token'
const CSRF_HEADER = 'x-csrf-token'
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  if (SAFE_METHODS.includes(req.method)) {
    const token = crypto.randomBytes(32).toString('hex')
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
    next()
    return
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE]
  const headerToken = req.headers[CSRF_HEADER] as string | undefined

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    next(new AppError('CSRF token validation failed.', 403, 'CSRF_ERROR'))
    return
  }

  const newToken = crypto.randomBytes(32).toString('hex')
  res.cookie(CSRF_COOKIE, newToken, {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  next()
}
