<template>
  <Card
    :class="[
      'flex flex-row gap-4 transition-all duration-300 w-full',
      variant === 'unpaid' && 'border-2 border-warning-amber shadow-glow',
      variant === 'past' && 'opacity-70 grayscale'
    ]"
  >
    <div class="flex-shrink-0">
      <img
        :src="posterUrl"
        :alt="movieTitle"
        class="w-20 h-28 object-cover rounded-lg"
        loading="lazy"
      >
    </div>

    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-bold text-white-mist mb-1 line-clamp-1">{{ movieTitle }}</h3>
      <p class="text-sm text-grey-text mb-2">{{ cinemaName }}</p>
      
      <div class="space-y-1 text-sm text-grey-text mb-3">
        <p>Дата: {{ formatDate(sessionDate.value) }}</p>
        <p>Время: {{ formatTime(sessionDate.value) }}</p>
        <p>Места: {{ seatsText }}</p>
      </div>

      <div class="flex flex-row items-center justify-between w-full">
        <div class="flex-shrink-0">
          <p class="text-xs text-grey-text mb-1">Сумма:</p>
          <p class="text-xl font-bold text-white-mist">{{ formatPrice(totalPrice) }}</p>
        </div>

        <div class="flex flex-row items-center gap-4 flex-shrink-0">
          <div v-if="variant === 'unpaid' && timer" class="text-right">
            <p class="text-xs text-grey-text mb-1">Осталось времени:</p>
            <CountdownTimer
              :formatted="timer.formatted"
              :is-expired="timer.isExpired"
              :is-critical="timer.isCritical"
            />
          </div>

          <div v-if="variant === 'unpaid' && timer && !timer.isExpired">
            <PaymentButton
              :booking-id="booking.id"
              :loading="paymentLoading"
              @paid="handlePaid"
            />
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Booking, MovieSession } from '~/shared/types/api.types'
import { useFormat } from '~/shared/composables/useFormat'
import { useBookingTimer } from '~/features/bookings/composables/useBookingTimer'
import Card from '~/shared/components/Card.vue'
import CountdownTimer from '~/features/bookings/components/CountdownTimer.vue'
import PaymentButton from '~/features/payments/components/PaymentButton.vue'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'

interface Props {
  booking: Booking
  session?: MovieSession | null
  movieTitle?: string
  cinemaName?: string
  posterUrl?: string
  variant: 'unpaid' | 'upcoming' | 'past'
  settings: { bookingPaymentTimeSeconds: number } | null
}

const props = defineProps<Props>()
const { formatDate, formatTime, formatPrice } = useFormat()
const config = useRuntimeConfig()
const moviesStore = useMoviesStore()
const cinemasStore = useCinemasStore()

const movie = computed(() => {
  if (props.movieTitle) return null
  if (!props.session) return null
  return moviesStore.movies.find(m => m.id === props.session!.movieId)
})

const cinema = computed(() => {
  if (props.cinemaName) return null
  if (!props.session) return null
  return cinemasStore.cinemas.find(c => c.id === props.session!.cinemaId)
})

const movieTitle = computed(() => {
  return props.movieTitle || movie.value?.title || 'Фильм'
})

const cinemaName = computed(() => {
  return props.cinemaName || cinema.value?.name || 'Кинотеатр'
})

const posterUrl = computed(() => {
  if (props.posterUrl) return props.posterUrl
  if (!movie.value) return ''
  if (movie.value.posterImage.startsWith('http')) {
    return movie.value.posterImage
  }
  return `${config.public.apiBase}${movie.value.posterImage}`
})

const sessionDate = computed(() => {
  return props.session?.startTime || new Date().toISOString()
})

const paymentLoading = ref(false)

const timer = ref<ReturnType<typeof useBookingTimer> | null>(null)

watch(() => [props.variant, props.booking.id, props.settings], () => {
  if (props.variant === 'unpaid' && props.settings) {
    timer.value = useBookingTimer(props.booking, props.settings)
  } else {
    timer.value = null
  }
}, { immediate: true })

const seatsText = computed(() => {
  if (props.booking.seats.length === 0) return 'Нет мест'
  if (props.booking.seats.length === 1) {
    return `Ряд ${props.booking.seats[0].rowNumber}, Место ${props.booking.seats[0].seatNumber}`
  }
  const sorted = [...props.booking.seats].sort((a, b) => {
    if (a.rowNumber !== b.rowNumber) return a.rowNumber - b.rowNumber
    return a.seatNumber - b.seatNumber
  })
  return sorted.map(s => `${s.rowNumber}-${s.seatNumber}`).join(', ')
})

const totalPrice = computed(() => {
  return props.booking.seats.length * 500
})

const emit = defineEmits<{
  paid: []
}>()

const handlePaid = () => {
  emit('paid')
}
</script>
