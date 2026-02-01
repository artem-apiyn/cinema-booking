<template>
  <div class="min-h-screen bg-deep-void flex items-center justify-center">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-md mx-auto">
        <h1 class="text-9xl font-bold text-cinema-rose mb-4">{{ _props.error.statusCode || 404 }}</h1>
        <h2 class="text-3xl font-bold text-white-mist mb-4">
          {{ _props.error.statusCode === 404 ? 'Страница не найдена' : 'Произошла ошибка' }}
        </h2>
        <p class="text-grey-text mb-8">
          {{ _props.error.statusCode === 404 
            ? 'Страница, которую вы ищете, не существует или была перемещена.' 
            : _props.error.message || _props.error.statusMessage || 'Что-то пошло не так. Пожалуйста, попробуйте позже.' }}
        </p>
        <div class="flex gap-4 justify-center">
          <Button @click="handleError">Вернуться на главную</Button>
          <Button variant="secondary" @click="goBack">Назад</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/shared/components/Button.vue'

const _props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const handleError = () => {
  clearError({ redirect: '/' })
}

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}
</script>
