import mongoose from 'mongoose'

let cachedConnection: typeof mongoose | null = null

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection
  }

  let mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is required in production. Set it to your MongoDB Atlas connection string.')
    }
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create()
    mongoUri = mongod.getUri()
    console.log('Using in-memory MongoDB (no MONGO_URI set in .env)')
  }

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  })

  cachedConnection = await mongoose.connect(mongoUri)
  return cachedConnection
}
