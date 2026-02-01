import type { Seat } from '~/shared/types/api.types'

export function useSeatSelection(
  totalSeats: ComputedRef<{ rows: number; seatsPerRow: number }> | { rows: number; seatsPerRow: number },
  bookedSeats: ComputedRef<Seat[]> | Seat[]
) {
  const selectedSeats = ref<Seat[]>([])

  const isSeatBooked = (row: number, seat: number): boolean => {
    const seats = unref(bookedSeats)
    return seats.some(
      booked => booked.rowNumber === row && booked.seatNumber === seat
    )
  }

  const isSeatSelected = (row: number, seat: number): boolean => {
    return selectedSeats.value.some(
      selected => selected.rowNumber === row && selected.seatNumber === seat
    )
  }

  const toggleSeat = (row: number, seat: number) => {
    if (isSeatBooked(row, seat)) {
      return
    }

    const index = selectedSeats.value.findIndex(
      s => s.rowNumber === row && s.seatNumber === seat
    )

    if (index > -1) {
      selectedSeats.value.splice(index, 1)
    } else {
      selectedSeats.value.push({ rowNumber: row, seatNumber: seat })
    }
  }

  const clearSelection = () => {
    selectedSeats.value = []
  }

  const totalPrice = computed(() => {
    return selectedSeats.value.length * 500
  })

  return {
    selectedSeats,
    isSeatBooked,
    isSeatSelected,
    toggleSeat,
    clearSelection,
    totalPrice
  }
}
