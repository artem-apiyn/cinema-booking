<template>
  <div v-if="password.length > 0" class="mt-2">
    <div class="flex items-center gap-2">
      <div class="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
        <div
          :class="[
            'h-full transition-all duration-300',
            strength.level === 1 && 'bg-error-red w-1/3',
            strength.level === 2 && 'bg-warning-amber w-2/3',
            strength.level === 3 && 'bg-success-green w-full'
          ]"
        />
      </div>
      <span :class="['text-xs font-medium', strength.color]">
        {{ strength.text }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  password: string
}

const props = defineProps<Props>()

const strength = computed(() => {
  const pwd = props.password
  if (pwd.length === 0) return { level: 0, text: '', color: '' }
  
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^a-zA-Z0-9]/.test(pwd)) score++

  if (score <= 2) return { level: 1, text: 'Слабый', color: 'text-error-red' }
  if (score <= 4) return { level: 2, text: 'Средний', color: 'text-warning-amber' }
  return { level: 3, text: 'Сильный', color: 'text-success-green' }
})
</script>
