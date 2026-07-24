import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Spinner } from './Spinner'
import type { AuthFormValues } from '@/types'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('A valid email is required.'),
  password: z.string().min(1, 'Password is required.'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(60),
  email: z.string().min(1, 'Email is required.').email('A valid email is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

interface AuthFormProps {
  mode: 'login' | 'register'
  loading: boolean
  serverError: string
  onSubmit: (values: AuthFormValues) => void
}

export function AuthForm({ mode, loading, serverError, onSubmit }: AuthFormProps) {
  const isLogin = mode === 'login'
  const schema = isLogin ? loginSchema : registerSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-shape auth-hero-shape--1" />
        <div className="auth-hero-shape auth-hero-shape--2" />
        <div className="auth-hero-shape auth-hero-shape--3" />
        <div className="auth-hero-content">
          <h1 className="auth-hero-logo">TaskFlow</h1>
          <p className="auth-hero-tagline">
            Organize your work, boost your productivity, and never miss a deadline.
          </p>
          <div className="auth-hero-stats">
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">10K+</span>
              <span className="auth-hero-stat-label">Tasks Completed</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">99%</span>
              <span className="auth-hero-stat-label">Uptime</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">4.9</span>
              <span className="auth-hero-stat-label">User Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-card">
          <h1>{isLogin ? 'Welcome back' : 'Get started'}</h1>
          <p className="subtle">
            {isLogin
              ? 'Sign in to access your tasks and stay on track.'
              : 'Create an account and start managing your tasks.'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {!isLogin && (
              <label className="field">
                <span>Full name</span>
                <input placeholder="John Doe" {...register('name')} />
                {errors.name && <small className="error">{errors.name.message}</small>}
              </label>
            )}

            <label className="field">
              <span>Email address</span>
              <input type="email" placeholder="john@example.com" {...register('email')} />
              {errors.email && <small className="error">{errors.email.message}</small>}
            </label>

            <label className="field">
              <span>Password</span>
              <input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <small className="error">{errors.password.message}</small>}
            </label>

            {serverError && <div className="feedback error-box">{serverError}</div>}

            <button className="button" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading && <Spinner />}
              {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="switch-auth">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create one' : 'Sign in'}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
