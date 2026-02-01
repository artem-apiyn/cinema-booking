<template>
  <div class="min-h-screen bg-deep-void">
    <header class="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-elevated">
      <div class="container mx-auto px-4 py-4">
        <Navigation />
      </div>
    </header>

    <main>
      <slot />
    </main>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/shared/components/Navigation.vue'
import Toast from '~/shared/components/Toast.vue'
</script>