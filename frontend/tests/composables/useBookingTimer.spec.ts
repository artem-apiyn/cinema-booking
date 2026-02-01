import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useBookingTimer } from '~/features/bookings/composables/useBookingTimer'
import type { Booking, Settings } from '~/shared/types/api.types'

const createTestComponent = (booking: Booking, settings: Settings | null) => {
  return defineComponent({
    setup() {
      const timer = useBookingTimer(booking, settings)
      return { ...timer }
    },
    template: '<div></div>'
  })
}

describe('useBookingTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createBooking = (bookedAt: string, isPaid: boolean = false): Booking => ({
    id: '1',
    movieSessionId: 1,
    seats: [],
    bookedAt,
    isPaid
  })

  const createSettings = (timeoutSeconds: number = 300): Settings => ({
    bookingPaymentTimeSeconds: timeoutSeconds
  })

  it('returns expired state for paid bookings', () => {
    const booking = createBooking('2024-01-01T11:00:00Z', true)
    const settings = createSettings(300)
    
    const TestComponent = createTestComponent(booking, settings)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.isExpired.value).toBe(true)
    expect(wrapper.vm.formatted.value).toBe('00:00')
  })

  it('returns expired state when settings are null', () => {
    const booking = createBooking('2024-01-01T11:00:00Z', false)
    
    const TestComponent = createTestComponent(booking, null)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.isExpired.value).toBe(true)
    expect(wrapper.vm.formatted.value).toBe('00:00')
  })

  it('calculates remaining time correctly', () => {
    const bookedAt = new Date('2024-01-01T11:58:20Z').toISOString()
    const booking = createBooking(bookedAt, false)
    const settings = createSettings(300)
    
    const TestComponent = createTestComponent(booking, settings)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining.value).toBe(200)
    expect(wrapper.vm.formatted.value).toBe('03:20')
  })

  it('shows critical state when less than 60 seconds remaining', () => {
    const bookedAt = new Date('2024-01-01T11:55:50Z').toISOString()
    const booking = createBooking(bookedAt, false)
    const settings = createSettings(300)
    
    const TestComponent = createTestComponent(booking, settings)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining.value).toBe(50)
    expect(wrapper.vm.isCritical.value).toBe(true)
  })

  it('does not show critical state when more than 60 seconds remaining', () => {
    const bookedAt = new Date('2024-01-01T11:58:20Z').toISOString()
    const booking = createBooking(bookedAt, false)
    const settings = createSettings(300)
    
    const TestComponent = createTestComponent(booking, settings)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining.value).toBe(200)
    expect(wrapper.vm.isCritical.value).toBe(false)
  })

  it('returns zero when time has expired', () => {
    const bookedAt = new Date('2024-01-01T11:53:20Z').toISOString()
    const booking = createBooking(bookedAt, false)
    const settings = createSettings(300)
    
    const TestComponent = createTestComponent(booking, settings)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining.value).toBe(0)
    expect(wrapper.vm.isExpired.value).toBe(true)
    expect(wrapper.vm.formatted.value).toBe('00:00')
  })

  it('updates remaining time over time', async () => {
    const bookedAt = new Date('2024-01-01T11:58:00Z').toISOString()
    const booking = createBooking(bookedAt, false)
    const settings = createSettings(300)
    
    const TestComponent = createTestComponent(booking, settings)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining.value).toBe(120)
    
    vi.advanceTimersByTime(10000)
    await nextTick()
    await nextTick()
    
    expect(wrapper.vm.remaining.value).toBe(110)
  })
})
