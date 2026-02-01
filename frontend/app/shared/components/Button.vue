<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-void',
      variantClasses,
      sizeClasses,
      disabled && 'opacity-50 cursor-not-allowed',
      loading && 'cursor-wait'
    ]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="inline-flex items-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <span v-if="loadingText">{{ loadingText }}</span>
      <span v-else><slot /></span>
    </span>
    <span v-else><slot /></span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  loadingText: ''
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-cinema-rose text-white-mist hover:bg-cinema-rose-hover focus:ring-cinema-rose shadow-glow'
    case 'secondary':
      return 'bg-surface text-white-mist hover:bg-elevated focus:ring-surface border border-elevated'
    case 'ghost':
      return 'text-grey-text hover:text-white-mist hover:bg-surface focus:ring-surface'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-4 py-2 text-base'
    case 'lg':
      return 'px-6 py-3 text-lg'
    default:
      return ''
  }
})
</script>
