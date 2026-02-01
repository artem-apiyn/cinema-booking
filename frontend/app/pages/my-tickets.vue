<template>
  <div class="my-tickets-container container mx-auto px-4 py-8 w-full min-h-screen">
    <h1 class="text-3xl font-bold text-white-mist mb-8">Мои билеты</h1>

    <div v-if="loading" class="flex justify-center items-center min-h-[400px] w-full">
      <Loader />
    </div>

    <div v-else class="w-full">
      <div class="flex flex-row gap-4 mb-8 border-b border-elevated w-full overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'px-6 py-3 font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
            activeTab === tab.key
              ? 'text-cinema-rose'
              : 'text-grey-text hover:text-white-mist'
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            class="ml-2 px-2 py-0.5 text-xs bg-elevated rounded"
          >
            {{ tab.count }}
          </span>
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-cinema-rose"
          />
        </button>
      </div>

      <div class="w-full">
        <BookingList
          v-if="activeTab === 'unpaid'"
          :bookings="unpaidBookings"
          :sessions="allSessions"
          variant="unpaid"
          :settings="settings"
          empty-message="У вас нет неоплаченных билетов"
          @paid="handlePaid"
        />
        
        <BookingList
          v-else-if="activeTab === 'upcoming'"
          :bookings="upcomingBookings"
          :sessions="allSessions"
          variant="upcoming"
          :settings="settings"
          empty-message="У вас нет будущих билетов"
        />
        
        <BookingList
          v-else
          :bookings="pastBookings"
          :sessions="allSessions"
          variant="past"
          :settings="settings"
          empty-message="У вас нет прошедших билетов"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Booking, Settings, MovieSession, MovieSessionDetails } from '~/shared/types/api.types'
import { useApi } from '~/shared/composables/useApi'
import { useBookingsStore } from '~/stores/bookings'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'
import BookingList from '~/features/bookings/components/BookingList.vue'
import Loader from '~/shared/components/Loader.vue'

definePageMeta({
  middleware: 'auth'
})

const bookingsStore = useBookingsStore()
const moviesStore = useMoviesStore()
const cinemasStore = useCinemasStore()
const { apiFetch } = useApi()

const loading = ref(true)
const activeTab = ref<'unpaid' | 'upcoming' | 'past'>('unpaid')
const settings = ref<Settings | null>(null)
const sessions = ref<MovieSession[]>([])

const allSessions = computed(() => sessions.value)

const unpaidBookings = computed((): Booking[] => {
  const now = new Date()
  return bookingsStore.bookings.filter(booking => {
    if (booking.isPaid) return false
    const bookedAt = new Date(booking.bookedAt)
    const elapsed = (now.getTime() - bookedAt.getTime()) / 1000
    const timeout = settings.value?.bookingPaymentTimeSeconds || 300
    return elapsed < timeout
  }).map(booking => ({
    ...booking,
    seats: [...booking.seats]
  })) as Booking[]
})

const upcomingBookings = computed((): Booking[] => {
  const now = new Date()
  return bookingsStore.bookings.filter(booking => {
    if (!booking.isPaid) return false
    const session = allSessions.value.find(s => s.id === booking.movieSessionId)
    if (!session) return false
    return new Date(session.startTime) >= now
  }).map(booking => ({
    ...booking,
    seats: [...booking.seats]
  })) as Booking[]
})

const pastBookings = computed((): Booking[] => {
  const now = new Date()
  return bookingsStore.bookings.filter(booking => {
    if (!booking.isPaid) return false
    const session = allSessions.value.find(s => s.id === booking.movieSessionId)
    if (!session) return true
    return new Date(session.startTime) < now
  }).map(booking => ({
    ...booking,
    seats: [...booking.seats]
  })) as Booking[]
})

const tabs = computed(() => [
  { key: 'unpaid' as const, label: 'Неоплаченные', count: unpaidBookings.value.length },
  { key: 'upcoming' as const, label: 'Будущие', count: upcomingBookings.value.length },
  { key: 'past' as const, label: 'Прошедшие', count: pastBookings.value.length }
])

const handlePaid = async () => {
  await bookingsStore.fetchBookings()
}

const fetchData = async () => {
  loading.value = true
  try {
    await Promise.all([
      bookingsStore.fetchBookings(),
      bookingsStore.fetchSettings(),
      moviesStore.fetchMovies(),
      cinemasStore.fetchCinemas()
    ])
    
    settings.value = bookingsStore.settings
    
    const allBookings = bookingsStore.bookings
    const sessionIds = [...new Set(allBookings.map(b => b.movieSessionId))]
    
    const sessionPromises = sessionIds.map(async (id) => {
      try {
        const sessionDetails = await apiFetch<MovieSessionDetails>(`/movieSessions/${id}`)
        const { seats, bookedSeats, ...session } = sessionDetails
        return session as MovieSession
      } catch {
        return null
      }
    })
    
    const fetchedSessions = await Promise.all(sessionPromises)
    sessions.value = fetchedSessions.filter((s): s is MovieSession => s !== null)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.my-tickets-container {
  display: block !important;
}
</style>
