import { Router } from 'express'
import { login, register } from '../controllers/authController'
import { validateRequest } from '../middleware/validateRequest'
import { loginRateLimiter } from '../middleware/rateLimiters'
import { loginValidator, registerValidator } from '../validators/authValidators'

const router = Router()

router.post('/register', registerValidator, validateRequest, register)
router.post('/login', loginRateLimiter, loginValidator, validateRequest, login)

console.log('[authRoutes] registering /login and /register')

export = router
