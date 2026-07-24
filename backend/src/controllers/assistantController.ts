import { type Response } from 'express'
import Task from '../models/Task'
import type { AuthRequest } from '../middleware/authMiddleware'

interface Suggestion {
  type: 'tip' | 'insight' | 'reminder'
  message: string
}

async function generateSuggestions(userId: string): Promise<Suggestion[]> {
  const tasks = await Task.find({ user: userId }).sort({ dueDate: 1 })

  if (tasks.length === 0) {
    return [{
      type: 'tip',
      message: 'You have no tasks yet. Start by creating your first task!',
    }]
  }

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const suggestions: Suggestion[] = []

  const overdue = tasks.filter((t) => t.status !== 'Done' && new Date(t.dueDate) < now)
  if (overdue.length > 0) {
    suggestions.push({
      type: 'reminder',
      message: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. "${overdue[0].title}" ${overdue.length > 1 ? `and ${overdue.length - 1} more ` : ''}needs attention.`,
    })
  }

  const dueSoon = tasks.filter((t) => {
    const diff = new Date(t.dueDate).getTime() - now.getTime()
    return t.status !== 'Done' && diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000
  })
  if (dueSoon.length > 0) {
    suggestions.push({
      type: 'reminder',
      message: `${dueSoon.length} task${dueSoon.length > 1 ? 's are' : ' is'} due within 3 days. Plan your time accordingly.`,
    })
  }

  const done = tasks.filter((t) => t.status === 'Done')
  const total = tasks.length
  if (total > 0) {
    const pct = Math.round((done.length / total) * 100)
    suggestions.push({
      type: 'insight',
      message: `You've completed ${done.length} of ${total} tasks (${pct}%). Keep going!`,
    })
  }

  const highPriority = tasks.filter((t) => t.priority === 'High' && t.status !== 'Done')
  if (highPriority.length > 2) {
    suggestions.push({
      type: 'tip',
      message: `You have ${highPriority.length} high-priority tasks. Consider focusing on the most urgent ones first.`,
    })
  }

  const todo = tasks.filter((t) => t.status === 'To Do')
  if (todo.length > 5) {
    suggestions.push({
      type: 'tip',
      message: `Your backlog has ${todo.length} items. Try breaking them into smaller sub-tasks.`,
    })
  }

  return suggestions
}

export const getSuggestions = async (req: AuthRequest, res: Response): Promise<Response> => {
  const userId = req.userId!
  const suggestions = await generateSuggestions(userId)
  return res.status(200).json({ suggestions })
}
