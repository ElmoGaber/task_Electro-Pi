import dotenv from 'dotenv'
import app from './app'
import { connectDatabase } from './config/db'
import { autoSeed } from './utils/seed'

dotenv.config()

const port = process.env.PORT || 5000

const startServer = async (): Promise<void> => {
  await connectDatabase()
  await autoSeed()
  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
