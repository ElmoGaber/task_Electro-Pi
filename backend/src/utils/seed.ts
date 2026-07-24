import bcrypt from 'bcryptjs'
import User from '../models/User'
import Task from '../models/Task'

export const autoSeed = async (): Promise<void> => {
  const count = await User.countDocuments()
  if (count > 0) return

  console.log('Seeding demo user...')

  const passwordHash = await bcrypt.hash('demo123456', 10)
  const adminHash = await bcrypt.hash('admin123456', 10)
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@taskflow.dev',
    passwordHash,
  })
  await User.create({
    name: 'Admin',
    email: 'admin@taskflow.dev',
    passwordHash: adminHash,
    role: 'admin',
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
  console.log(`Demo user created — demo@taskflow.dev / demo123456 (${tasks.length} tasks)`)
}
