import dotenv from 'dotenv'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app = require('./app')
import { connectDatabase } from './config/db'
import { autoSeed } from './utils/seed'

dotenv.config()

const port = process.env.PORT || 5000
const server = http.createServer(app)

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log(`[socket] client connected: ${socket.id}`)

  socket.on('join:tasks', (userId: string) => {
    socket.join(`user:${userId}`)
    socket.to(`user:${userId}`).emit('presence:online', { userId, socketId: socket.id })
  })

  socket.on('typing:start', ({ userId, taskId }: { userId: string; taskId?: string }) => {
    socket.to(`user:${userId}`).emit('typing:indicator', { userId, taskId, typing: true })
  })

  socket.on('typing:stop', ({ userId, taskId }: { userId: string; taskId?: string }) => {
    socket.to(`user:${userId}`).emit('typing:indicator', { userId, taskId, typing: false })
  })

  socket.on('disconnect', () => {
    console.log(`[socket] client disconnected: ${socket.id}`)
  })
})

export { io }

const startServer = async (): Promise<void> => {
  await connectDatabase()
  await autoSeed()
  server.listen(port, () => {
    console.log(`Backend server listening on port ${port}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
