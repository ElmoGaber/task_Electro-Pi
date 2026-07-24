import mongoose from 'mongoose'

export const connectDatabase = async (): Promise<void> => {
  let mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create()
    mongoUri = mongod.getUri()
    console.log('Using in-memory MongoDB (no MONGO_URI set in .env)')
  }

  await mongoose.connect(mongoUri)
  console.log(`MongoDB connected: ${mongoose.connection.host}`)
}
