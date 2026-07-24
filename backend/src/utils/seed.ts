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
    { user: user._id, title: 'Finance App Dashboard', description: 'Design the main dashboard layout with analytics and charts.', status: 'Done', priority: 'High', dueDate: new Date('2025-07-20') },
    { user: user._id, title: 'Crypto Landing Page', description: 'Build a modern landing page for the crypto tracking app.', status: 'Done', priority: 'High', dueDate: new Date('2025-07-22') },
    { user: user._id, title: 'E-learning Platform Backend', description: 'Implement REST API for course management and user progress.', status: 'In Progress', priority: 'High', dueDate: new Date('2025-07-28') },
    { user: user._id, title: 'E-commerce Checkout Flow', description: 'Build the complete checkout flow with payment integration.', status: 'In Progress', priority: 'Medium', dueDate: new Date('2025-08-02') },
    { user: user._id, title: 'Dark Mode Implementation', description: 'Add dark/light theme toggle with system preference detection.', status: 'Editing', priority: 'Medium', dueDate: new Date('2025-08-05') },
    { user: user._id, title: 'User Profile Page', description: 'Create the user profile page with avatar upload and settings.', status: 'Editing', priority: 'Low', dueDate: new Date('2025-08-08') },
    { user: user._id, title: 'Notification System', description: 'Build real-time notifications with Socket.IO integration.', status: 'To Do', priority: 'High', dueDate: new Date('2025-08-15') },
    { user: user._id, title: 'Mobile Responsive Design', description: 'Ensure the app works perfectly on all screen sizes.', status: 'To Do', priority: 'Medium', dueDate: new Date('2025-08-20') },
  ]

  await Task.insertMany(tasks)
  console.log(`Demo user created — demo@taskflow.dev / demo123456 (${tasks.length} tasks)`)
}
