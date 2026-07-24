import { body, param, query } from 'express-validator'
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants'

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 120 })
    .withMessage('Title must be up to 120 characters.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.')
    .isLength({ max: 1000 })
    .withMessage('Description must be up to 1000 characters.'),
  body('status')
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}.`),
  body('priority')
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}.`),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required.')
    .isISO8601()
    .withMessage('Due date must be a valid date.'),
]

export const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task id.'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty.')
    .isLength({ max: 120 })
    .withMessage('Title must be up to 120 characters.'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty.')
    .isLength({ max: 1000 })
    .withMessage('Description must be up to 1000 characters.'),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}.`),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}.`),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date.'),
]

export const listTaskValidator = [
  query('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}.`),
  query('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}.`),
  query('search').optional().isString().withMessage('Search must be a string.'),
]

export const deleteTaskValidator = [param('id').isMongoId().withMessage('Invalid task id.')]
