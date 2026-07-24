import { Router } from 'express'
import { createTask, deleteTask, listTasks, updateTask } from '../controllers/taskController'
import { authMiddleware } from '../middleware/authMiddleware'
import { validateRequest } from '../middleware/validateRequest'
import {
  createTaskValidator,
  deleteTaskValidator,
  listTaskValidator,
  updateTaskValidator,
} from '../validators/taskValidators'

const router = Router()

router.use(authMiddleware)

router.get('/', listTaskValidator, validateRequest, listTasks)

router.post('/', createTaskValidator, validateRequest, createTask)

router.put('/:id', updateTaskValidator, validateRequest, updateTask)

router.delete('/:id', deleteTaskValidator, validateRequest, deleteTask)

export default router
