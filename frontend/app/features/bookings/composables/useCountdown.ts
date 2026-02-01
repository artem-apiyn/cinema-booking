export function useCountdown(targetSeconds: Ref<number> | number) {
  const isTargetRef = isRef(targetSeconds)
  const initialValue = isTargetRef ? targetSeconds.value : targetSeconds
  const remaining = ref(Math.max(0, initialValue))
  const isExpired = computed(() => remaining.value <= 0)
  
  let intervalId: ReturnType<typeof setInterval> | null = null

  const formatted = computed(() => {
    if (remaining.value <= 0) return '00:00'
    const mins = Math.floor(remaining.value / 60)
    const secs = remaining.value % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  const updateRemaining = () => {
    if (isTargetRef) {
      const newValue = targetSeconds.value
      remaining.value = Math.max(0, newValue)
    } else {
      remaining.value = Math.max(0, remaining.value - 1)
    }
  }

  const start = () => {
    if (intervalId) return
    
    intervalId = setInterval(() => {
      updateRemaining()
      if (remaining.value <= 0 && intervalId) {
        stop()
      }
    }, 1000)
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const reset = () => {
    stop()
    const resetValue = isTargetRef ? targetSeconds.value : targetSeconds
    remaining.value = Math.max(0, resetValue)
  }

  if (isTargetRef) {
    watch(targetSeconds, (newValue) => {
      remaining.value = Math.max(0, newValue)
    }, { immediate: true })
  }

  onMounted(() => {
    if (isTargetRef) {
      remaining.value = Math.max(0, targetSeconds.value)
    }
    start()
  })

  onUnmounted(() => {
    stop()
  })

  return {
    remaining: readonly(remaining),
    isExpired,
    formatted,
    start,
    stop,
    reset
  }
}
