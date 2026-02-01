<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'min-w-[300px] max-w-md bg-surface rounded-lg shadow-lg p-4 border-l-4',
            'backdrop-blur-sm',
            toast.type === 'success' && 'border-success-green',
            toast.type === 'error' && 'border-error-red',
            toast.type === 'warning' && 'border-warning-amber',
            toast.type === 'info' && 'border-cinema-rose'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-white-mist">{{ toast.message }}</p>
            </div>
            <button
              class="ml-4 text-grey-text hover:text-white-mist transition-colors"
              aria-label="Close"
              @click="removeToast(toast.id)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/shared/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
