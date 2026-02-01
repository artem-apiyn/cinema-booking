<template>
  <Transition name="slide-up">
    <div
      v-if="selectedSeats && selectedSeats.length > 0"
      class="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-elevated p-4 z-40"
    >
      <div class="container mx-auto flex items-center justify-between gap-4">
        <div class="flex-1">
          <p class="text-sm text-grey-text mb-1">Выбранные места:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="seat in selectedSeats"
              :key="`${seat.rowNumber}-${seat.seatNumber}`"
              class="px-3 py-1 bg-elevated rounded text-sm text-white-mist"
            >
              Ряд {{ seat.rowNumber }}, Место {{ seat.seatNumber }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-sm text-grey-text">Итого:</p>
            <p class="text-2xl font-bold text-white-mist">{{ formatPrice(totalPrice) }}</p>
          </div>
          <Button
            :disabled="disabled || loading"
            :loading="loading"
            size="lg"
            @click="handleBookClick"
          >
            Забронировать
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Seat } from '~/shared/types/api.types'
import { useFormat } from '~/shared/composables/useFormat'
import Button from '~/shared/components/Button.vue'

interface Props {
  selectedSeats: Seat[]
  totalPrice: number
  disabled?: boolean
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  book: []
}>()

const { formatPrice } = useFormat()

const handleBookClick = () => {
  emit('book')
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
