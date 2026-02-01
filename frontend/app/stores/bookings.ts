import { defineStore } from 'pinia'
import type { Booking, Seat, Settings } from '~/shared/types/api.types'
import { useApi } from '~/shared/composables/useApi'

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([])
  const settings = ref<Settings | null>(null)

  const unpaidBookings = computed(() => {
    const now = new Date()
    return bookings.value.filter(booking => {
      if (booking.isPaid) return false
      const bookedAt = new Date(booking.bookedAt)
      const elapsed = (now.getTime() - bookedAt.getTime()) / 1000
      const timeout = settings.value?.bookingPaymentTimeSeconds || 300
      return elapsed < timeout
    })
  })

  const upcomingBookings = computed(() => {
    return bookings.value.filter(booking => booking.isPaid)
  })

  const pastBookings = computed(() => {
    return []
  })

  async function fetchBookings() {
    const { apiFetch } = useApi()
    bookings.value = await apiFetch<Booking[]>('/me/bookings')
    return bookings.value
  }

  async function fetchSettings() {
    const { apiFetch } = useApi()
    settings.value = await apiFetch<Settings>('/settings')
    return settings.value
  }

  async function createBooking(movieSessionId: number, seats: Seat[]) {
    const { apiFetch } = useApi()
    const seatsArray = Array.isArray(seats) ? seats : unref(seats)
    const response = await apiFetch<{ bookingId: string }>(`/movieSessions/${movieSessionId}/bookings`, {
      method: 'POST',
      body: { seats: seatsArray }
    })
    await fetchBookings()
    return response
  }

  async function payBooking(bookingId: string) {
    const { apiFetch } = useApi()
    await apiFetch(`/bookings/${bookingId}/payments`, {
      method: 'POST'
    })
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) {
      booking.isPaid = true
    }
    return booking
  }

  return {
    bookings: readonly(bookings),
    settings: readonly(settings),
    unpaidBookings,
    upcomingBookings,
    pastBookings,
    fetchBookings,
    fetchSettings,
    createBooking,
    payBooking
  }
})
