import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        <div className="auth-hero-content">
          <h1 className="auth-hero-logo">{t('auth.heroTitle')}</h1>
          <p className="auth-hero-tagline">{t('auth.heroSubtitle')}</p>
          <div className="auth-hero-stats">
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">10K+</span>
              <span className="auth-hero-stat-label">{t('auth.tasksManaged')}</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">99%</span>
              <span className="auth-hero-stat-label">{t('auth.productivity')}</span>
            </div>
            <div className="auth-hero-stat">
              <span className="auth-hero-stat-value">4.9</span>
              <span className="auth-hero-stat-label">{t('auth.activeUsers')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-card">
          <h1>{isLogin ? t('auth.welcomeBack') : t('auth.getStarted')}</h1>
          <p className="subtle">
            {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {!isLogin && (
              <label className="field">
                <span>{t('auth.name')}</span>
                <input placeholder="John Doe" {...register('name')} />
                {errors.name && <small className="error">{errors.name.message}</small>}
              </label>
            )}

            <label className="field">
              <span>{t('auth.email')}</span>
              <input type="email" placeholder="john@example.com" {...register('email')} />
              {errors.email && <small className="error">{errors.email.message}</small>}
            </label>

            <label className="field">
              <span>{t('auth.password')}</span>
              <input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <small className="error">{errors.password.message}</small>}
            </label>

            {serverError && <div className="feedback error-box">{serverError}</div>}

            <button className="button" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading && <Spinner />}
              {loading ? t('auth.loggingIn') : isLogin ? t('auth.signIn') : t('auth.signUp')}
            </button>
          </form>

          <p className="switch-auth">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <Link to={isLogin ? '/register' : '/login'}>{isLogin ? t('auth.createOne') : t('auth.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
