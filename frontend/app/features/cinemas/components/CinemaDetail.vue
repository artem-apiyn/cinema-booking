<template>
  <div v-if="cinema" class="space-y-8">
    <div>
      <h1 class="text-4xl font-bold text-white-mist mb-4">{{ cinema.name }}</h1>
      <p class="text-grey-text text-lg">{{ cinema.address }}</p>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-white-mist mb-6">Сеансы</h2>
      <SessionTable
        v-if="sessions.length > 0"
        :sessions="sessions"
        :cinemas="[cinema]"
        :movies="movies"
        :show-movies="true"
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
import type { Cinema, MovieSession } from '~/shared/types/api.types'
import SessionTable from '~/features/movies/components/SessionTable.vue'
import Loader from '~/shared/components/Loader.vue'
import { useMoviesStore } from '~/stores/movies'

interface Props {
  cinema: Cinema | null
  sessions: readonly MovieSession[]
}

defineProps<Props>()

const moviesStore = useMoviesStore()
const movies = computed(() => moviesStore.movies)
</script>
