import { type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { AppError, UnauthorizedError } from '../errors/AppError'

const createToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new AppError('JWT secret is not configured.', 500, 'SERVER_CONFIG_ERROR')
  }

  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' })
}

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new AppError('Email is already in use.', 409, 'CONFLICT')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  })

  const token = createToken(user._id.toString())

  return res.status(201).json({
    message: 'Registered successfully.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw new UnauthorizedError('Invalid email or password.')
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password.')
  }

  const token = createToken(user._id.toString())

  return res.status(200).json({
    message: 'Logged in successfully.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}
