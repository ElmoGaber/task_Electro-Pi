import mongoose, { Document, Schema } from 'mongoose'
import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from '../utils/constants'

export interface ITask extends Document {
  user: mongoose.Types.ObjectId
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      required: true,
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      required: true,
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

taskSchema.index({ user: 1, title: 1 })
taskSchema.index({ user: 1, status: 1 })
taskSchema.index({ user: 1, priority: 1 })
taskSchema.index({ user: 1, status: 1, priority: 1, dueDate: 1 })

export default mongoose.model<ITask>('Task', taskSchema)
