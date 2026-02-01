<template>
  <div v-if="movie" class="space-y-8">
    <div class="relative h-[400px] rounded-2xl overflow-hidden">
      <img
        :src="posterUrl"
        :alt="movie.title"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-deep-void via-deep-void/80 to-transparent"/>
      <div class="absolute inset-0 flex items-center">
        <div class="container mx-auto px-4">
          <div class="flex gap-8">
            <img
              :src="posterUrl"
              :alt="movie.title"
              class="w-48 h-72 object-cover rounded-lg shadow-2xl hidden md:block"
            >
            <div class="flex-1">
              <h1 class="text-4xl font-bold text-white-mist mb-4">{{ movie.title }}</h1>
              <div class="flex flex-wrap gap-4 text-grey-text mb-4">
                <span>{{ movie.year }}</span>
                <span>•</span>
                <span>{{ formatDuration(movie.lengthMinutes) }}</span>
                <span>•</span>
                <span>⭐ {{ movie.rating.toFixed(1) }}</span>
              </div>
              <p class="text-grey-text leading-relaxed max-w-2xl">{{ movie.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-white-mist mb-6">Сеансы</h2>
      <SessionTable
        v-if="sessions.length > 0"
        :sessions="sessions"
        :cinemas="cinemas"
      />
      <div v-else class="text-center py-12">
        <p class="text-grey-text">Сеансы не найдены</p>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12">
    <Loader />
  </div>
</template>

<script setup lang="ts">
import type { Movie, MovieSession, Cinema } from '~/shared/types/api.types'
import { useFormat } from '~/shared/composables/useFormat'
import SessionTable from '~/features/movies/components/SessionTable.vue'
import Loader from '~/shared/components/Loader.vue'

interface Props {
  movie: Movie | null
  sessions: readonly MovieSession[]
  cinemas: readonly Cinema[]
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const { formatDuration } = useFormat()

const posterUrl = computed(() => {
  if (!props.movie) return ''
  if (props.movie.posterImage.startsWith('http')) {
    return props.movie.posterImage
  }
  return `${config.public.apiBase}${props.movie.posterImage}`
})
</script>
