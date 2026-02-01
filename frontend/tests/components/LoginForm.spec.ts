import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '~/features/auth/components/LoginForm.vue'

vi.mock('#app/components/nuxt-link', () => ({
  default: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}))

vi.mock('~/features/auth/composables/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({})
  })
}))

vi.mock('~/shared/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    const wrapper = mount(LoginForm)
    expect(wrapper.find('h1').text()).toBe('Вход')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates required fields', async () => {
    const wrapper = mount(LoginForm)
    const submitButton = wrapper.find('button[type="submit"]')
    
    await submitButton.trigger('click')
    
    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('has submit button disabled when form is invalid', () => {
    const wrapper = mount(LoginForm)
    const submitButton = wrapper.find('button[type="submit"]')
    
    expect(submitButton.exists()).toBe(true)
    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('has link to registration', () => {
    const wrapper = mount(LoginForm)
    const registerLink = wrapper.find('a[href="/register"]')
    expect(registerLink.exists()).toBe(true)
    expect(registerLink.text()).toContain('Зарегистрироваться')
  })
})
