import type { User } from '@/types'

const MOCK_USERS_KEY = 'taskflow-mock-users'
const DEMO_EMAIL = 'demo@taskflow.dev'
const DEMO_PASSWORD = 'demo123456'
const ADMIN_EMAIL = 'admin@taskflow.dev'
const ADMIN_PASSWORD = 'admin123456'

interface MockUser {
  name: string
  email: string
  password: string
  id: string
  role?: string
}

function getUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveUsers(users: MockUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

function genId() { return Math.random().toString(36).slice(2, 9) }

export function mockRegister(values: { name: string; email: string; password: string }) {
  const users = getUsers()
  const exists = users.find((u) => u.email === values.email.toLowerCase())
  if (exists) throw new Error('Email is already in use.')
  const newUser: MockUser = { name: values.name, email: values.email.toLowerCase(), password: values.password, id: genId() }
  saveUsers([...users, newUser])
  return {
    token: `mock-token-${newUser.id}`,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role || 'user' } as User,
  }
}

export function mockLogin(email: string, password: string) {
  const users = getUsers()
  const user = users.find((u) => u.email === email.toLowerCase() && u.password === password)
  if (user) {
    return {
      token: `mock-token-${user.id}`,
      user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' } as User,
    }
  }
  if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return { token: 'mock-token-demo', user: { id: 'demo-1', name: 'Demo User', email: DEMO_EMAIL, role: 'user' } as User }
  }
  if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return { token: 'mock-token-admin', user: { id: 'admin-1', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' } as User }
  }
  throw new Error('Invalid email or password.')
}

export function isNetworkError(error: unknown): boolean {
  return !(error as { response?: unknown })?.response
}
