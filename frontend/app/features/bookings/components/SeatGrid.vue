<template>
  <div class="space-y-6">
    <div class="flex flex-col items-center mb-8">
      <div class="w-full max-w-2xl relative">
        <svg
          viewBox="0 0 400 100"
          class="w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#F8FAFC;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#F8FAFC;stop-opacity:0" />
            </linearGradient>
          </defs>
          <polygon
            points="50,20 350,20 380,80 20,80"
            fill="url(#screenGradient)"
            stroke="#F8FAFC"
            stroke-width="2"
            opacity="0.6"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="text-white-mist font-bold text-lg">ЭКРАН</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center overflow-x-auto pb-32">
      <div class="inline-block">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 flex-shrink-0" />
          <div
            v-for="seat in seatsPerRow"
            :key="seat"
            class="w-8 text-center text-grey-text text-xs font-medium flex-shrink-0"
          >
            {{ seat }}
          </div>
        </div>
        <div
          v-for="row in rows"
          :key="row"
          class="flex items-center gap-2 mb-2"
        >
          <div class="w-8 text-center text-grey-text font-medium flex-shrink-0">
            {{ row }}
          </div>
          
          <button
            v-for="seat in seatsPerRow"
            :key="seat"
            :disabled="isSeatBooked(row, seat)"
            :class="[
              'w-8 h-8 rounded transition-all duration-200 flex-shrink-0',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-void',
              getSeatClass(row, seat),
              isSeatBooked(row, seat) && 'cursor-not-allowed opacity-50',
              !isSeatBooked(row, seat) && 'cursor-pointer hover:scale-110'
            ]"
            :title="`Ряд ${row}, Место ${seat}`"
            @click="toggleSeat(row, seat)"
          >
            <svg
              v-if="isSeatBooked(row, seat)"
              class="w-full h-full text-white-mist"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div class="w-8 flex-shrink-0" />
          <div
            v-for="seat in seatsPerRow"
            :key="seat"
            class="w-8 text-center text-grey-text text-xs font-medium flex-shrink-0"
          >
            {{ seat }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rows: number
  seatsPerRow: number
  bookedSeats: Array<{ rowNumber: number; seatNumber: number }>
  selectedSeats: Array<{ rowNumber: number; seatNumber: number }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  seatToggle: [row: number, seat: number]
}>()

const isSeatBooked = (row: number, seat: number): boolean => {
  return props.bookedSeats.some(
    booked => booked.rowNumber === row && booked.seatNumber === seat
  )
}

const isSeatSelected = (row: number, seat: number): boolean => {
  return props.selectedSeats.some(
    selected => selected.rowNumber === row && selected.seatNumber === seat
  )
}

const getSeatClass = (row: number, seat: number): string => {
  if (isSeatBooked(row, seat)) {
    return 'bg-disabled border-2 border-disabled'
  }
  if (isSeatSelected(row, seat)) {
    return 'bg-cinema-rose border-2 border-cinema-rose shadow-glow animate-pulse-glow'
  }
  return 'bg-transparent border-2 border-grey-text hover:bg-elevated'
}

const toggleSeat = (row: number, seat: number) => {
  if (!isSeatBooked(row, seat)) {
    emit('seatToggle', row, seat)
  }
}
</script>
