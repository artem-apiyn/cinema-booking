<template>
  <div
    :class="[
      'bg-surface rounded-xl p-6 transition-all duration-300 w-full',
      hover && 'hover:shadow-glow cursor-pointer',
      glow && 'shadow-glow',
      customClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  hover?: boolean
  glow?: boolean
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  hover: false,
  glow: false,
  customClass: ''
})
</script>
