const { connectDatabase } = require('../backend/dist/config/db')
const { autoSeed } = require('../backend/dist/utils/seed')
const app = require('../backend/dist/app')

let initializing = false

app.use(async (req, res, next) => {
  if (initializing) {
    return res.status(503).json({ success: false, message: 'Server is starting up. Please try again in a moment.' })
  }
  try {
    await connectDatabase()
    if (!initializing) {
      initializing = true
      await autoSeed().catch(() => {})
    }
    next()
  } catch (err) {
    console.error('Database connection error:', err)
    res.status(500).json({ success: false, message: 'Database connection failed.' })
  }
})

module.exports = app
