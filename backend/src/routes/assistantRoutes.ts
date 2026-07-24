import { Router } from 'express'
import { getSuggestions } from '../controllers/assistantController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.get('/suggestions', authMiddleware, getSuggestions)

export = router
