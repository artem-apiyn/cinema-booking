import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useCountdown } from '~/features/bookings/composables/useCountdown'

const createTestComponent = (initialValue: number) => {
  return defineComponent({
    setup() {
      const countdown = useCountdown(initialValue)
      return { ...countdown }
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
    
    expect(wrapper.vm.remaining.value).toBe(300)
    expect(wrapper.vm.formatted.value).toBe('05:00')
  })

  it('formats time correctly', () => {
    const TestComponent = createTestComponent(125)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.formatted.value).toBe('02:05')
  })

  it('decrements remaining time', async () => {
    const TestComponent = createTestComponent(60)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining.value).toBe(60)
    expect(wrapper.vm.formatted.value).toBe('01:00')
    
    vi.advanceTimersByTime(1000)
    await nextTick()
    await nextTick()
    
    expect(wrapper.vm.remaining.value).toBe(59)
    expect(wrapper.vm.formatted.value).toBe('00:59')
  })

  it('stops at zero', async () => {
    const TestComponent = createTestComponent(2)
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.remaining.value).toBe(2)
    expect(wrapper.vm.isExpired.value).toBe(false)
    
    vi.advanceTimersByTime(2000)
    await nextTick()
    await nextTick()
    
    expect(wrapper.vm.remaining.value).toBe(0)
    expect(wrapper.vm.isExpired.value).toBe(true)
    expect(wrapper.vm.formatted.value).toBe('00:00')
  })
})
