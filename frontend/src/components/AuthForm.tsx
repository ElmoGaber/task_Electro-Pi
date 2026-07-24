import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
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
    <div className="auth-layout">
      <form className="card auth-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        <p className="subtle">
          {isLogin ? 'Welcome back, please sign in.' : 'Create your account to manage tasks.'}
        </p>

        {!isLogin && (
          <label className="field">
            <span>Name</span>
            <input {...register('name')} />
            {errors.name && <small className="error">{errors.name.message}</small>}
          </label>
        )}

        <label className="field">
          <span>Email</span>
          <input type="email" {...register('email')} />
          {errors.email && <small className="error">{errors.email.message}</small>}
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" {...register('password')} />
          {errors.password && <small className="error">{errors.password.message}</small>}
        </label>

        {serverError && <div className="feedback error-box">{serverError}</div>}

        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>

        <p className="switch-auth">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register' : 'Login'}</Link>
        </p>
      </form>
    </div>
  )
}
