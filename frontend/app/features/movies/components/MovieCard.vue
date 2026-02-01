<template>
  <Card custom-class="group relative overflow-hidden" hover>
    <div class="relative aspect-[2/3] overflow-hidden rounded-lg mb-4">
      <img
        :src="posterUrl"
        :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      <div class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <Button
          class="w-full"
          @click="navigateToSessions"
        >
          Просмотреть сеансы
        </Button>
      </div>
    </div>
    <h3 class="text-lg font-bold text-white-mist mb-1 line-clamp-1">{{ movie.title }}</h3>
    <p class="text-sm text-grey-text">{{ movie.year }} • {{ formatDuration(movie.lengthMinutes) }}</p>
  </Card>
</template>

<script setup lang="ts">
import type { Movie } from '~/shared/types/api.types'
import { useFormat } from '~/shared/composables/useFormat'
import Card from '~/shared/components/Card.vue'
import Button from '~/shared/components/Button.vue'

interface Props {
  movie: Movie
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const { formatDuration } = useFormat()

const posterUrl = computed(() => {
  if (props.movie.posterImage.startsWith('http')) {
    return props.movie.posterImage
  }
  return `${config.public.apiBase}${props.movie.posterImage}`
})

const navigateToSessions = () => {
  navigateTo(`/movies/${props.movie.id}`)
}
</script>
