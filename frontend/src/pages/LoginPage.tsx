import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import api from '@/api/client'
import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/context/useAuth'
import { mockLogin, isNetworkError } from '@/lib/mockAuth'
import type { AuthFormValues, AuthResponse } from '@/types'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (values: AuthFormValues) => {
    setServerError('')
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', values)
      login(data)
      toast.success(t('auth.loginSuccess'))
      navigate('/')
    } catch (error: unknown) {
      if (isNetworkError(error)) {
        try {
          const data = mockLogin(values.email, values.password)
          login(data)
          toast.success(t('auth.loginSuccess'))
          navigate('/')
          return
        } catch (mockErr) {
          setServerError((mockErr as Error).message)
          return
        }
      }
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to login.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm mode="login" loading={loading} serverError={serverError} onSubmit={handleSubmit} />
  )
}
