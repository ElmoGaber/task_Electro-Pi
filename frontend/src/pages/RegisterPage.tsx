import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import api from '@/api/client'
import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/context/useAuth'
import { mockRegister, shouldUseMockFallback } from '@/lib/mockAuth'
import type { AuthFormValues, AuthResponse } from '@/types'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (values: AuthFormValues) => {
    setServerError('')
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', values)
      login(data)
      toast.success(t('auth.registerSuccess'))
      navigate('/')
    } catch (error: unknown) {
      if (shouldUseMockFallback(error)) {
        try {
          const data = mockRegister(values)
          login(data)
          toast.success(t('auth.registerSuccess'))
          navigate('/')
          return
        } catch (mockErr) {
          setServerError((mockErr as Error).message)
          return
        }
      }
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to register.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm mode="register" loading={loading} serverError={serverError} onSubmit={handleSubmit} />
  )
}
