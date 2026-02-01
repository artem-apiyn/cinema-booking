<template>
  <div
    :class="[
      'text-3xl font-mono font-bold transition-colors duration-300',
      isExpired && 'text-error-red',
      isCritical && !isExpired && 'text-error-red animate-pulse',
      !isCritical && !isExpired && 'text-warning-amber'
    ]"
  >
    <span v-if="isExpired">Время истекло</span>
    <span v-else>{{ formatted }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  formatted: string
  isExpired: boolean
  isCritical: boolean
}

defineProps<Props>()
</script>
