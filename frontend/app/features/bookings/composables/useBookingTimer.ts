import type { Booking, Settings } from '~/shared/types/api.types'
import { useCountdown } from './useCountdown'

export function useBookingTimer(booking: Booking, settings: Settings | null) {
  if (!settings || booking.isPaid) {
    return {
      remaining: ref(0),
      isExpired: computed(() => true),
      formatted: computed(() => '00:00'),
      isCritical: computed(() => false),
      start: () => {},
      stop: () => {},
      reset: () => {}
    }
  }

  const currentTime = ref(Date.now())
  
  let timeIntervalId: ReturnType<typeof setInterval> | null = null

  const remainingSeconds = computed(() => {
    const bookedAt = new Date(booking.bookedAt).getTime()
    const now = currentTime.value
    const elapsed = Math.floor((now - bookedAt) / 1000)
    const timeout = settings.bookingPaymentTimeSeconds
    const remaining = Math.max(0, timeout - elapsed)
    return remaining
  })

  const countdown = useCountdown(remainingSeconds)

  const isCritical = computed(() => {
    const remaining = countdown.remaining.value
    return remaining > 0 && remaining < 60
  })

  onMounted(() => {
    timeIntervalId = setInterval(() => {
      currentTime.value = Date.now()
    }, 1000)
  })

  onUnmounted(() => {
    if (timeIntervalId) {
      clearInterval(timeIntervalId)
      timeIntervalId = null
    }
  })

  return {
    ...countdown,
    isCritical
  }
}
