import type { Toast } from '~/shared/types/global.types'

export const useToast = () => {
  if (!import.meta.client) {
    return {
      toasts: readonly(ref<Toast[]>([])),
      showToast: () => '',
      removeToast: () => {},
      success: () => '',
      error: () => '',
      warning: () => '',
      info: () => ''
    }
  }

  let toasts: Ref<Toast[]>
  try {
    toasts = useState<Toast[]>('toasts', () => [])
  } catch {
    toasts = ref<Toast[]>([])
  }

  const showToast = (message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = Date.now().toString()
    const toast: Toast = { id, message, type, duration }
    
    toasts.value.push(toast)

    if (duration > 0 && import.meta.client) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => showToast(message, 'success', duration)
  const error = (message: string, duration?: number) => showToast(message, 'error', duration)
  const warning = (message: string, duration?: number) => showToast(message, 'warning', duration)
  const info = (message: string, duration?: number) => showToast(message, 'info', duration)

  return {
    toasts: readonly(toasts),
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
