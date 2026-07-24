import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from './models/User'
import Task from './models/Task'
import { connectDatabase } from './config/db'

dotenv.config()

const seed = async (): Promise<void> => {
  await connectDatabase()

  const existing = await User.findOne({ email: 'demo@taskflow.dev' })
  if (existing) {
    console.log('Demo user already exists. Skipping seed.')
    await mongoose.disconnect()
    return
  }

  const passwordHash = await bcrypt.hash('demo123456', 10)
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@taskflow.dev',
    passwordHash,
  })

  const tasks = [
    { user: user._id, title: 'Set up project repository', description: 'Initialize git repo and push the initial commit.', status: 'Done', priority: 'High', dueDate: new Date('2025-07-20') },
    { user: user._id, title: 'Design database schema', description: 'Define User and Task models with Mongoose.', status: 'Done', priority: 'High', dueDate: new Date('2025-07-22') },
    { user: user._id, title: 'Implement authentication', description: 'Build register/login endpoints with JWT and bcrypt.', status: 'In Progress', priority: 'High', dueDate: new Date('2025-07-28') },
    { user: user._id, title: 'Create task CRUD API', description: 'Build endpoints for creating, reading, updating, and deleting tasks.', status: 'In Progress', priority: 'Medium', dueDate: new Date('2025-08-02') },
    { user: user._id, title: 'Build dashboard UI', description: 'Create the main dashboard page with task list, filters, and search.', status: 'To Do', priority: 'Medium', dueDate: new Date('2025-08-10') },
    { user: user._id, title: 'Add dark mode support', description: 'Implement theme toggle with light/dark mode using CSS variables.', status: 'To Do', priority: 'Low', dueDate: new Date('2025-08-15') },
    { user: user._id, title: 'Write unit tests', description: 'Add test coverage for auth and task controllers.', status: 'To Do', priority: 'Low', dueDate: new Date('2025-08-20') },
    { user: user._id, title: 'Submit final project', description: 'Package and submit the completed project for review.', status: 'To Do', priority: 'High', dueDate: new Date('2025-07-15') },
  ]

  await Task.insertMany(tasks)

  console.log('Seed complete!')
  console.log('Login credentials:')
  console.log('  Email:    demo@taskflow.dev')
  console.log('  Password: demo123456')
  console.log(`  Tasks created: ${tasks.length}`)

  await mongoose.disconnect()
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
