<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '~/features/auth/components/RegisterForm.vue'

definePageMeta({
  middleware: 'guest'
})
</script>
