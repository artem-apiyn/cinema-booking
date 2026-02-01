<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-white-mist mb-2">
      {{ label }}
      <span v-if="required" class="text-error-red">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-3 rounded-lg bg-elevated text-white-mist placeholder-text-muted',
          'border border-transparent focus:border-cinema-rose focus:ring-2 focus:ring-cinema-rose focus:ring-opacity-20',
          'transition-all duration-300 outline-none',
          error && 'border-error-red focus:border-error-red focus:ring-error-red',
          disabled && 'opacity-50 cursor-not-allowed',
          type === 'password' && 'pr-12'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
      <button
        v-if="type === 'password'"
        type="button"
        :class="[
          'absolute right-3 top-1/2 -translate-y-1/2 p-1 text-grey-text hover:text-white-mist transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-cinema-rose focus:ring-opacity-20 rounded'
        ]"
        @click.stop.prevent="togglePasswordVisibility"
        @mousedown.prevent
      >
        <svg
          v-if="!isPasswordVisible"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      </button>
    </div>
    <p v-if="error" class="mt-1 text-sm text-error-red">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-text-muted">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  showPassword?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'text',
  placeholder: '',
  error: '',
  hint: '',
  required: false,
  disabled: false,
  showPassword: false
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  'update:showPassword': [value: boolean]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const inputRef = ref<HTMLInputElement | null>(null)

const isPasswordVisible = ref(props.showPassword)

const inputType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const togglePasswordVisibility = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const selectionStart = inputRef.value?.selectionStart || 0
  const selectionEnd = inputRef.value?.selectionEnd || 0
  
  isPasswordVisible.value = !isPasswordVisible.value
  
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.setSelectionRange(selectionStart, selectionEnd)
      inputRef.value.focus()
    }
  })
}

watch(() => props.showPassword, (newValue) => {
  isPasswordVisible.value = newValue
})
</script>
