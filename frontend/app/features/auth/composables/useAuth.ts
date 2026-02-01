import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/shared/composables/useToast'
import type { LoginCredentials } from '../types/auth.types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials)
      toast.success('Успешный вход')
      router.push('/my-tickets')
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      const message = apiError?.data?.message || 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: { username: string; password: string; passwordConfirmation: string }) => {
    try {
      await authStore.register({
        username: data.username,
        password: data.password
      })
      toast.success('Регистрация успешна')
      router.push('/my-tickets')
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      const message = apiError?.data?.message || 'Ошибка регистрации'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    authStore.logout()
    toast.info('Вы вышли из системы')
    router.push('/movies')
  }

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    login,
    register,
    logout
  }
}
