import { ref } from 'vue'

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  function addToast(toast: Omit<ToastItem, 'id'>) {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const duration = toast.duration || 4000

    const item: ToastItem = {
      id,
      ...toast
    }

    toasts.value.push(item)

    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(title: string, description?: string) {
    return addToast({ title, description, type: 'success' })
  }

  function error(title: string, description?: string) {
    return addToast({ title, description, type: 'error' })
  }

  function info(title: string, description?: string) {
    return addToast({ title, description, type: 'info' })
  }

  function warning(title: string, description?: string) {
    return addToast({ title, description, type: 'warning' })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}
