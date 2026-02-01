<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
    />
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/shared/types/api.types'
import MovieCard from '~/features/movies/components/MovieCard.vue'

interface Props {
  movies: readonly Movie[]
}

defineProps<Props>()
</script>
