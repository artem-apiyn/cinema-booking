<template>
  <Card custom-class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-white-mist mb-6 text-center">Вход</h1>
    
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <Input
        v-model="formData.username"
        label="Имя пользователя"
        placeholder="Введите имя пользователя"
        :error="errors.username"
        required
        @blur="validateField('username')"
      />

      <Input
        v-model="formData.password"
        label="Пароль"
        type="password"
        placeholder="Введите пароль"
        :error="errors.password"
        required
        @blur="validateField('password')"
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
        Войти
      </Button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-grey-text">
        Нет аккаунта?
        <NuxtLink to="/register" class="text-cinema-rose hover:text-cinema-rose-hover transition-colors">
          Зарегистрироваться
        </NuxtLink>
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { loginSchema, type LoginFormData } from '~/shared/utils/validation'
import { useAuth } from '~/features/auth/composables/useAuth'
import Card from '~/shared/components/Card.vue'
import Input from '~/shared/components/Input.vue'
import Button from '~/shared/components/Button.vue'

const { login } = useAuth()

const formData = reactive<LoginFormData>({
  username: '',
  password: ''
})

const errors = reactive<Partial<Record<keyof LoginFormData, string>>>({})
const loading = ref(false)
const errorMessage = ref('')

const isFormValid = computed(() => {
  return formData.username.length > 0 && formData.password.length > 0
})

const validateField = (field: keyof LoginFormData) => {
  try {
    loginSchema.pick({ [field]: true }).parse({ [field]: formData[field] })
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
    errors[key as keyof LoginFormData] = ''
  })

  try {
    loginSchema.parse(formData)
  } catch (error: unknown) {
    const zodError = error as { errors?: Array<{ path: (string | number)[]; message: string }> }
    if (zodError.errors) {
      zodError.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData
        errors[field] = err.message
      })
    }
    return
  }

  loading.value = true
  try {
    await login(formData)
  } catch (error: unknown) {
    const apiError = error as { data?: { message?: string } }
    errorMessage.value = apiError?.data?.message || 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова'
  } finally {
    loading.value = false
  }
}
</script>
