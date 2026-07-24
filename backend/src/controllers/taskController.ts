import { type Response } from 'express'
import Task from '../models/Task'
import { NotFoundError } from '../errors/AppError'
import type { AuthRequest } from '../middleware/authMiddleware'

export const listTasks = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { search = '', status, priority } = req.query as Record<string, string | undefined>
  const query: Record<string, unknown> = { user: req.userId }

  if (search.trim()) {
    query.title = { $regex: search.trim(), $options: 'i' }
  }
  if (status) {
    query.status = status
  }
  if (priority) {
    query.priority = priority
  }

  const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 })

  return res.status(200).json({ tasks })
}

export const createTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  const task = await Task.create({
    ...req.body,
    user: req.userId,
  })

  return res.status(201).json({
    message: 'Task created successfully.',
    task,
  })
}

export const updateTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true, runValidators: true },
  )

  if (!task) {
    throw new NotFoundError('Task not found.')
  }

  return res.status(200).json({
    message: 'Task updated successfully.',
    task,
  })
}

export const deleteTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  })

  if (!task) {
    throw new NotFoundError('Task not found.')
  }

  return res.status(200).json({ message: 'Task deleted successfully.' })
}
