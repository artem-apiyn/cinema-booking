<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    :class="[
      'shimmer rounded-lg bg-elevated',
      customClass
    ]"
    :style="{ width, height }"
  />
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  customClass: ''
})
</script>
