import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('task-manager-token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const csrfToken = getCSRFToken()
  if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method)) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('task-manager-token')
      localStorage.removeItem('task-manager-user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

function getCSRFToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export default api
