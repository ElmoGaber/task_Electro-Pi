import { Router } from 'express'
import multer from 'multer'
import { uploadFile } from '../controllers/uploadController'
import { authMiddleware } from '../middleware/authMiddleware'

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|mp3|wav|ogg|webm)$/i
    if (allowed.test(file.originalname)) {
      cb(null, true)
    } else {
      cb(new Error('Unsupported file type.'))
    }
  },
})

const router = Router()

router.post('/', authMiddleware, upload.single('file'), uploadFile)

export = router
