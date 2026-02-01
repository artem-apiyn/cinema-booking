import { describe, it, expect } from 'vitest'
import { useSeatSelection } from '~/features/bookings/composables/useSeatSelection'

describe('useSeatSelection', () => {
  const totalSeats = { rows: 5, seatsPerRow: 10 }
  const bookedSeats = [
    { rowNumber: 1, seatNumber: 1 },
    { rowNumber: 2, seatNumber: 5 }
  ]

  it('initializes with empty selection', () => {
    const { selectedSeats } = useSeatSelection(totalSeats, bookedSeats)
    expect(selectedSeats.value).toEqual([])
  })

  it('detects booked seats correctly', () => {
    const { isSeatBooked } = useSeatSelection(totalSeats, bookedSeats)
    expect(isSeatBooked(1, 1)).toBe(true)
    expect(isSeatBooked(2, 5)).toBe(true)
    expect(isSeatBooked(1, 2)).toBe(false)
  })

  it('toggles seat selection', () => {
    const { toggleSeat, isSeatSelected, selectedSeats } = useSeatSelection(totalSeats, bookedSeats)
    
    expect(isSeatSelected(3, 3)).toBe(false)
    
    toggleSeat(3, 3)
    expect(isSeatSelected(3, 3)).toBe(true)
    expect(selectedSeats.value).toHaveLength(1)
    
    toggleSeat(3, 3)
    expect(isSeatSelected(3, 3)).toBe(false)
    expect(selectedSeats.value).toHaveLength(0)
  })

  it('cannot select booked seats', () => {
    const { toggleSeat, isSeatSelected } = useSeatSelection(totalSeats, bookedSeats)
    
    toggleSeat(1, 1)
    expect(isSeatSelected(1, 1)).toBe(false)
  })

  it('calculates total price correctly', () => {
    const { toggleSeat, totalPrice } = useSeatSelection(totalSeats, bookedSeats)
    
    expect(totalPrice.value).toBe(0)
    
    toggleSeat(3, 3)
    toggleSeat(3, 4)
    expect(totalPrice.value).toBe(1000)
  })
})
