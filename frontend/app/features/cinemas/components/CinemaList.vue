<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <CinemaCard
      v-for="cinema in cinemas"
      :key="cinema.id"
      :cinema="cinema"
    />
  </div>
</template>

<script setup lang="ts">
import type { Cinema } from '~/shared/types/api.types'
import CinemaCard from '~/features/cinemas/components/CinemaCard.vue'

interface Props {
  cinemas: readonly Cinema[]
}

defineProps<Props>()
</script>
