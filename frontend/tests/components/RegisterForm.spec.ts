import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterForm from '~/features/auth/components/RegisterForm.vue'

vi.mock('#app/components/nuxt-link', () => ({
  default: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}))

vi.mock('~/features/auth/composables/useAuth', () => ({
  useAuth: () => ({
    register: vi.fn().mockResolvedValue({ token: 'mock-token' })
  })
}))

vi.mock('~/shared/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('RegisterForm', () => {
  it('renders registration form correctly', () => {
    const wrapper = mount(RegisterForm)
    expect(wrapper.find('h1').text()).toBe('Регистрация')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.findAll('input[type="password"]').length).toBe(2)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates username field', async () => {
    const wrapper = mount(RegisterForm)
    const usernameInput = wrapper.find('input[type="text"]')
    
    await usernameInput.setValue('short')
    await usernameInput.trigger('blur')
    
    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('validates password field', async () => {
    const wrapper = mount(RegisterForm)
    const passwordInput = wrapper.findAll('input[type="password"]')[0]
    
    await passwordInput.setValue('short')
    await passwordInput.trigger('blur')
    expect(wrapper.vm.isFormValid).toBe(false)
    
    await passwordInput.setValue('nouppercase123')
    await passwordInput.trigger('blur')
    expect(wrapper.vm.isFormValid).toBe(false)
    
    await passwordInput.setValue('NoDigitsHere')
    await passwordInput.trigger('blur')
    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('validates password confirmation', async () => {
    const wrapper = mount(RegisterForm)
    const passwordInput = wrapper.findAll('input[type="password"]')[0]
    const confirmInput = wrapper.findAll('input[type="password"]')[1]
    
    await passwordInput.setValue('ValidPass123')
    await confirmInput.setValue('DifferentPass123')
    await confirmInput.trigger('blur')
    
    expect(wrapper.vm.isFormValid).toBe(false)
  })

  it('enables submit button when form is valid', async () => {
    const wrapper = mount(RegisterForm)
    const usernameInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.findAll('input[type="password"]')[0]
    const confirmInput = wrapper.findAll('input[type="password"]')[1]
    
    await usernameInput.setValue('validusername')
    await passwordInput.setValue('ValidPass123')
    await confirmInput.setValue('ValidPass123')
    
    expect(wrapper.vm.isFormValid).toBe(true)
  })

  it('has link to login page', () => {
    const wrapper = mount(RegisterForm)
    const loginLink = wrapper.find('a[href="/login"]')
    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toContain('Войти')
  })

  it('shows password strength indicator', () => {
    const wrapper = mount(RegisterForm)
    expect(wrapper.findComponent({ name: 'PasswordStrengthIndicator' }).exists()).toBe(true)
  })
})
