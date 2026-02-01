<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/features/auth/components/LoginForm.vue'

definePageMeta({
  middleware: 'guest'
})
</script>
