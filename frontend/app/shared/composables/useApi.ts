import { useToast } from '~/shared/composables/useToast'

let connectionErrorShown = false
const CONNECTION_ERROR_COOLDOWN = 10000

interface ConnectionError {
  message?: string
  name?: string
  code?: string
}

function isConnectionError(error: unknown): boolean {
  if (!error) return false
  
  const err = error as ConnectionError
  const message = err?.message?.toLowerCase() || ''
  const name = err?.name?.toLowerCase() || ''
  
  return (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('econnrefused') ||
    message.includes('failed to fetch') ||
    message.includes('no response') ||
    message.includes('networkerror') ||
    name === 'networkerror' ||
    name === 'typeerror' ||
    err?.code === 'ECONNREFUSED' ||
    err?.code === 'ENOTFOUND' ||
    err?.code === 'ETIMEDOUT'
  )
}

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const toast = import.meta.client ? useToast() : null

  interface RequestOptions {
    headers?: Headers | Record<string, string>
    method?: string
    body?: unknown
  }

  interface ResponseError {
    status?: number
    _data?: {
      message?: string
      error?: string
    }
  }

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }: { options: RequestOptions }) {
      const token = unref(authStore.token)
      const existingHeaders = options.headers || {}
      const headersObj = existingHeaders instanceof Headers 
        ? Object.fromEntries(existingHeaders.entries())
        : existingHeaders as Record<string, string>
      
      if (options.body && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
        if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
          headersObj['Content-Type'] = 'application/json'
        }
      }
      
      if (token) {
        headersObj['Authorization'] = `Bearer ${token}`
      }
      
      options.headers = new Headers(headersObj)
    },
    onRequestError({ error }: { error: unknown }) {
      if (!import.meta.client) return
      
      if (isConnectionError(error)) {
        if (!connectionErrorShown && toast) {
          connectionErrorShown = true
          toast.error(
            'Не удалось подключиться к серверу. Убедитесь, что backend запущен на http://localhost:3022',
            8000
          )
          
          setTimeout(() => {
            connectionErrorShown = false
          }, CONNECTION_ERROR_COOLDOWN)
        }
      } else {
        const err = error as ConnectionError
        const errorMessage = err?.message || 'Ошибка при выполнении запроса'
        if (errorMessage !== 'Failed to fetch' && errorMessage !== 'NetworkError' && toast) {
          toast.error(errorMessage)
        }
      }
    },
    onResponseError({ response }: { response: ResponseError }) {
      if (!import.meta.client) return
      
      const status = response?.status
      if (!status) return
      
      if (status === 401) {
        authStore.logout()
        navigateTo('/login')
      } else if (status >= 500) {
        toast?.error('Ошибка сервера. Попробуйте позже')
      } else if (status === 404) {
        toast?.warning('Ресурс не найден')
      } else if (status >= 400) {
        const errorData = response?._data
        const message = errorData?.message || errorData?.error || `Ошибка ${status}`
        toast?.error(message)
      }
    }
  })

  return { 
    apiFetch: apiFetch as <T = unknown>(request: string, options?: RequestOptions) => Promise<T>
  }
}
