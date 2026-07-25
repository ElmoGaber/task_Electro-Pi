const { connectDatabase } = require('../backend/dist/config/db')
const { autoSeed } = require('../backend/dist/utils/seed')
const app = require('../backend/dist/app')

let seeded = false

module.exports = async (req, res) => {
  try {
    await connectDatabase()
    if (!seeded) {
      seeded = true
      await autoSeed().catch(() => {})
    }
    return app(req, res)
  } catch (err) {
    console.error('Serverless handler error:', err)
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}
