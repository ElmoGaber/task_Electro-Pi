export interface User {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface ApiError {
  message: string
  code?: string
  errors?: { field: string; message: string }[]
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done'

export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  _id: string
  user: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskListResponse {
  tasks: Task[]
}

export interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

export interface TaskFiltersState {
  search: string
  status: string
  priority: string
}

export interface AuthFormValues {
  name?: string
  email: string
  password: string
}
