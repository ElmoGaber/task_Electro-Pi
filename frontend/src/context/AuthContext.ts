import { createContext } from 'react'
import type { User } from '@/types'

interface AuthContextValue {
  token: string | null
  user: User | null
  login: (data: { token: string; user: User }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export default AuthContext
export type { AuthContextValue }
