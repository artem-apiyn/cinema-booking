import { useToast } from '~/shared/composables/useToast'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  nuxtApp.hook('app:error', (error: Error) => {
    nextTick(() => {
      try {
        const toast = useToast()
        if (toast?.error) {
          toast.error(error.message || 'Произошла ошибка')
        }
      } catch {
        void 0
      }
    })
  })

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    nextTick(() => {
      try {
        const toast = useToast()
        if (toast?.error) {
          toast.error(event.reason?.message || 'Произошла ошибка')
        }
      } catch {
        void 0
      }
    })
  })
})
