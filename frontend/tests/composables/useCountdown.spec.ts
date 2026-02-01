import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useCountdown } from '~/features/bookings/composables/useCountdown'

const createTestComponent = (initialValue: number) => {
  return defineComponent({
    setup() {
      const countdown = useCountdown(initialValue)
      return {
        remaining: countdown.remaining,
        formatted: countdown.formatted,
        isExpired: countdown.isExpired,
        start: countdown.start,
        stop: countdown.stop,
        reset: countdown.reset
      }
    },
    template: '<div></div>'
  })
}

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with correct remaining time', () => {
    const TestComponent = createTestComponent(300)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining).toBe(300)
    expect(wrapper.vm.formatted).toBe('05:00')
  })

  it('formats time correctly', () => {
    const TestComponent = createTestComponent(125)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.formatted).toBe('02:05')
  })

  it('decrements remaining time', async () => {
    const TestComponent = createTestComponent(60)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining).toBe(60)
    expect(wrapper.vm.formatted).toBe('01:00')
    
    vi.advanceTimersByTime(1000)
    await nextTick()
    await nextTick()
    
    expect(wrapper.vm.remaining).toBe(59)
    expect(wrapper.vm.formatted).toBe('00:59')
  })

  it('stops at zero', async () => {
    const TestComponent = createTestComponent(2)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining).toBe(2)
    expect(wrapper.vm.isExpired).toBe(false)
    
    vi.advanceTimersByTime(2000)
    await nextTick()
    await nextTick()
    
    expect(wrapper.vm.remaining).toBe(0)
    expect(wrapper.vm.isExpired).toBe(true)
    expect(wrapper.vm.formatted).toBe('00:00')
  })
})
