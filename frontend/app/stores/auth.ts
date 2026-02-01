import { defineStore } from 'pinia'
import type { User, AuthResponse } from '~/shared/types/api.types'
import { useApi } from '~/shared/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  if (import.meta.client) {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      token.value = storedToken
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        user.value = { id: payload.sub, username: payload.username || '' }
      } catch {
        localStorage.removeItem('auth_token')
        token.value = null
      }
    }
  }

  async function login(credentials: { username: string; password: string }) {
    const { apiFetch } = useApi()
    
    const response = await apiFetch<AuthResponse>('/login', {
      method: 'POST',
      body: credentials
    })

    token.value = response.token
    if (import.meta.client) {
      localStorage.setItem('auth_token', response.token)
    }

    try {
      const payload = JSON.parse(atob(response.token.split('.')[1]))
      user.value = { id: payload.sub, username: credentials.username }
    } catch {
      void 0
    }

    return response
  }

  async function register(data: { username: string; password: string }) {
    const { apiFetch } = useApi()
    
    const response = await apiFetch<AuthResponse>('/register', {
      method: 'POST',
      body: data
    })

    token.value = response.token
    if (import.meta.client) {
      localStorage.setItem('auth_token', response.token)
    }

    try {
      const payload = JSON.parse(atob(response.token.split('.')[1]))
      user.value = { id: payload.sub, username: data.username }
    } catch {
      void 0
    }

    return response
  }

  function logout() {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    login,
    register,
    logout
  }
})
