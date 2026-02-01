<template>
  <div class="space-y-6 w-full">
    <div v-if="bookings.length === 0" class="text-center py-12 w-full">
      <p class="text-grey-text mb-4">{{ emptyMessage }}</p>
      <Button @click="navigateTo('/movies')">Найти сеанс</Button>
    </div>
    
    <div v-else class="space-y-4 w-full">
      <BookingCard
        v-for="booking in bookings"
        :key="booking.id"
        :booking="booking"
        :session="getSession(booking)"
        :variant="variant"
        :settings="settings"
        @paid="handlePaid"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking, Settings, MovieSession } from '~/shared/types/api.types'
import BookingCard from '~/features/bookings/components/BookingCard.vue'
import Button from '~/shared/components/Button.vue'

interface Props {
  bookings: readonly Booking[]
  sessions: readonly MovieSession[]
  variant: 'unpaid' | 'upcoming' | 'past'
  settings: Settings | null
  emptyMessage: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  paid: []
}>()

const getSession = (booking: Booking): MovieSession | null => {
  return props.sessions.find(s => s.id === booking.movieSessionId) || null
}

const handlePaid = () => {
  emit('paid')
}
</script>
