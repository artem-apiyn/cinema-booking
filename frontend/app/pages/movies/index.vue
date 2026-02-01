<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-white-mist mb-8">Фильмы</h1>
    
    <div v-if="loading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton v-for="i in 8" :key="i" height="400px" />
      </div>
    </div>
    
    <MovieGrid v-else-if="movies && movies.length > 0" :movies="movies" />
    
    <div v-else class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-error-red mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-white-mist text-lg font-medium mb-2">{{ error || 'Не удалось загрузить фильмы' }}</p>
        <p v-if="isConnectionError" class="text-grey-text text-sm mb-4">
          Убедитесь, что backend сервер запущен на
        </p>
        <code v-if="isConnectionError" class="block bg-surface px-4 py-2 rounded-lg text-cinema-rose mb-4 font-mono text-sm">
          http://localhost:3022
        </code>
        <Button v-if="isConnectionError" variant="secondary" size="sm" @click="retry">
          Попробовать снова
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMoviesStore } from '~/stores/movies'
import MovieGrid from '~/features/movies/components/MovieGrid.vue'
import Skeleton from '~/shared/components/Skeleton.vue'
import Button from '~/shared/components/Button.vue'

const moviesStore = useMoviesStore()
const movies = computed(() => [...(moviesStore.movies || [])])
const loading = ref(true)
const error = ref<string | null>(null)

const isConnectionError = computed(() => {
  const errorMsg = error.value?.toLowerCase() || ''
  return (
    errorMsg.includes('подключиться') ||
    errorMsg.includes('fetch') ||
    errorMsg.includes('network') ||
    errorMsg.includes('econnrefused')
  )
})

const fetchMovies = async () => {
  loading.value = true
  error.value = null
  try {
    await moviesStore.fetchMovies()
    if (movies.value.length === 0) {
      error.value = 'Фильмы не найдены'
    }
  } catch (err: unknown) {
    const apiError = err as { data?: { message?: string }; message?: string }
    error.value = apiError?.data?.message || apiError?.message || 'Ошибка при загрузке фильмов'
  } finally {
    loading.value = false
  }
}

const retry = () => {
  fetchMovies()
}

onMounted(() => {
  fetchMovies()
})
</script>
