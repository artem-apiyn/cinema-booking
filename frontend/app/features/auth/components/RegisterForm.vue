<template>
  <Card custom-class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-white-mist mb-6 text-center">Регистрация</h1>
    
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <Input
        v-model="formData.username"
        label="Имя пользователя"
        placeholder="Минимум 8 символов"
        :error="errors.username"
        required
        @blur="validateField('username')"
      />

      <div>
        <Input
          v-model="formData.password"
          label="Пароль"
          type="password"
          placeholder="Минимум 8 символов, заглавная буква и цифра"
          :error="errors.password"
          required
          @blur="validateField('password')"
        />
        <div class="mt-1">
          <PasswordStrengthIndicator :password="formData.password" />
        </div>
      </div>

      <Input
        v-model="formData.passwordConfirmation"
        label="Подтверждение пароля"
        type="password"
        placeholder="Повторите пароль"
        :error="errors.passwordConfirmation"
        required
        @blur="validateField('passwordConfirmation')"
      />

      <div v-if="errorMessage" class="p-3 bg-error-red/20 border border-error-red rounded-lg">
        <p class="text-sm text-error-red">{{ errorMessage }}</p>
      </div>

      <Button
        type="submit"
        :loading="loading"
        :disabled="!isFormValid"
        class="w-full"
      >
        Зарегистрироваться
      </Button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-grey-text">
        Уже есть аккаунт?
        <NuxtLink to="/login" class="text-cinema-rose hover:text-cinema-rose-hover transition-colors">
          Войти
        </NuxtLink>
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { registrationSchema, type RegistrationFormData } from '~/shared/utils/validation'
import { useAuth } from '~/features/auth/composables/useAuth'
import Card from '~/shared/components/Card.vue'
import Input from '~/shared/components/Input.vue'
import Button from '~/shared/components/Button.vue'
import PasswordStrengthIndicator from '~/features/auth/components/PasswordStrengthIndicator.vue'

const { register } = useAuth()

const formData = reactive<RegistrationFormData>({
  username: '',
  password: '',
  passwordConfirmation: ''
})

const errors = reactive<Partial<Record<keyof RegistrationFormData, string>>>({})
const loading = ref(false)
const errorMessage = ref('')

const isFormValid = computed(() => {
  return formData.username.length >= 8 &&
         formData.password.length >= 8 &&
         formData.passwordConfirmation.length >= 8 &&
         formData.password === formData.passwordConfirmation
})

const validateField = (field: keyof RegistrationFormData) => {
  try {
    registrationSchema.pick({ [field]: true }).parse({ [field]: formData[field] })
    errors[field] = ''
  } catch (error: unknown) {
    const zodError = error as { errors?: Array<{ message: string }> }
    if (zodError.errors?.[0]) {
      errors[field] = zodError.errors[0].message
    }
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof RegistrationFormData] = ''
  })

  try {
    registrationSchema.parse(formData)
  } catch (error: unknown) {
    const zodError = error as { errors?: Array<{ path: (string | number)[]; message: string }> }
    if (zodError.errors) {
      zodError.errors.forEach((err) => {
        const field = err.path[0] as keyof RegistrationFormData
        errors[field] = err.message
      })
    }
    return
  }

  loading.value = true
  try {
    await register(formData)
  } catch (error: unknown) {
    const apiError = error as { data?: { message?: string } }
    errorMessage.value = apiError?.data?.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>

