import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFound'
import { csrfProtection } from './middleware/csrf'
import { apiRateLimiter } from './middleware/rateLimiters'
import authRoutes = require('./routes/authRoutes')
import taskRoutes = require('./routes/taskRoutes')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(helmet())
app.use(compression())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json({ limit: '10kb' }))
app.use('/api', apiRateLimiter)

app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'API is healthy.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks', csrfProtection, taskRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export = app
