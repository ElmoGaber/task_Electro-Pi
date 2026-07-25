import { type Response } from 'express'
import path from 'path'
import fs from 'fs'
import os from 'os'
import crypto from 'crypto'
import type { AuthRequest } from '../middleware/authMiddleware'

const UPLOAD_DIR = process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'taskflow-uploads')
  : path.resolve(__dirname, '../../uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

export const uploadFile = async (req: AuthRequest, res: Response): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided.', code: 'NO_FILE' })
  }

  const ext = path.extname(req.file.originalname)
  const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  fs.writeFileSync(filepath, req.file.buffer)

  return res.status(200).json({
    message: 'File uploaded.',
    url: `/uploads/${filename}`,
  })
}
