<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <Loader />
    </div>
    
    <div v-else-if="sessionDetails" class="space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-white-mist mb-2">{{ movieTitle }}</h1>
        <p class="text-grey-text">{{ cinemaName }} • {{ formatDateTime(sessionDetails.startTime) }}</p>
      </div>

      <div class="pb-32">
        <SeatLegend class="mb-6" />
        <SeatGrid
          :rows="sessionDetails.seats.rows"
          :seats-per-row="sessionDetails.seats.seatsPerRow"
          :booked-seats="sessionDetails.bookedSeats"
          :selected-seats="selectedSeats"
          @seat-toggle="handleSeatToggle"
        />
      </div>

      <BookingCart
        :selected-seats="selectedSeats"
        :total-price="totalPrice"
        :disabled="!isAuthenticated"
        :loading="bookingLoading"
        @book="handleBooking"
      />
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-grey-text">Сеанс не найден</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { MovieSessionDetails } from '~/shared/types/api.types'
import { useSeatSelection } from '~/features/bookings/composables/useSeatSelection'
import { useFormat } from '~/shared/composables/useFormat'
import { useToast } from '~/shared/composables/useToast'
import { useApi } from '~/shared/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { useBookingsStore } from '~/stores/bookings'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'
import Loader from '~/shared/components/Loader.vue'
import SeatLegend from '~/features/bookings/components/SeatLegend.vue'
import SeatGrid from '~/features/bookings/components/SeatGrid.vue'
import BookingCart from '~/features/bookings/components/BookingCart.vue'

const route = useRoute()
const { apiFetch } = useApi()
const { formatDateTime } = useFormat()
const authStore = useAuthStore()
const bookingsStore = useBookingsStore()
const moviesStore = useMoviesStore()
const cinemasStore = useCinemasStore()
const toast = useToast()

const sessionId = computed(() => parseInt(route.params.id as string))
const sessionDetails = ref<MovieSessionDetails | null>(null)
const loading = ref(true)
const bookingLoading = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const seatSelection = useSeatSelection(
  computed(() => sessionDetails.value?.seats || { rows: 0, seatsPerRow: 0 }),
  computed(() => sessionDetails.value?.bookedSeats || [])
)

const selectedSeats = seatSelection.selectedSeats
const toggleSeat = seatSelection.toggleSeat
const totalPrice = seatSelection.totalPrice

const movieTitle = computed(() => {
  if (!sessionDetails.value) return ''
  const movie = moviesStore.movies.find(m => m.id === sessionDetails.value!.movieId)
  return movie?.title || 'Фильм'
})

const cinemaName = computed(() => {
  if (!sessionDetails.value) return ''
  const cinema = cinemasStore.cinemas.find(c => c.id === sessionDetails.value!.cinemaId)
  return cinema?.name || 'Кинотеатр'
})

const handleSeatToggle = (row: number, seat: number) => {
  if (!isAuthenticated.value) {
    toast.warning('Войдите, чтобы забронировать места')
    navigateTo({
      path: '/login',
      query: { redirect: route.fullPath }
    })
    return
  }
  toggleSeat(row, seat)
}

const handleBooking = async () => {
  if (!isAuthenticated.value) {
    toast.warning('Войдите, чтобы забронировать места')
    navigateTo({
      path: '/login',
      query: { redirect: route.fullPath }
    })
    return
  }

  const seatsArray = selectedSeats.value || []
  
  if (seatsArray.length === 0) {
    toast.warning('Выберите места для бронирования')
    return
  }

  if (!sessionId.value || isNaN(sessionId.value)) {
    toast.error('Неверный ID сеанса')
    return
  }

  bookingLoading.value = true
  try {
    await bookingsStore.createBooking(sessionId.value, seatsArray)
    toast.success('Бронирование успешно создано')
    navigateTo('/my-tickets')
  } catch (error: unknown) {
    const apiError = error as { data?: { message?: string }; message?: string; statusCode?: number }
    const message = apiError?.data?.message || apiError?.message || 'Ошибка при создании бронирования'
    toast.error(message)
  } finally {
    bookingLoading.value = false
  }
}

onMounted(async () => {
  try {
    sessionDetails.value = await apiFetch<MovieSessionDetails>(`/movieSessions/${sessionId.value}`)
    
    await Promise.all([
      moviesStore.fetchMovies(),
      cinemasStore.fetchCinemas()
    ])
  } catch {
    toast.error('Не удалось загрузить информацию о сеансе')
  } finally {
    loading.value = false
  }
})
</script>
