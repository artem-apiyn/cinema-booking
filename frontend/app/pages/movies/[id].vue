<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
    <div v-else-if="error" class="text-center py-12">
      <p class="text-grey-text">{{ error }}</p>
    </div>
    <MovieDetail
      v-else-if="movie"
      :movie="movie"
      :sessions="sessions"
      :cinemas="cinemas"
    />
    <div v-else class="text-center py-12">
      <p class="text-grey-text">Фильм не найден</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '~/stores/movies'
import { useCinemasStore } from '~/stores/cinemas'
import MovieDetail from '~/features/movies/components/MovieDetail.vue'
import Loader from '~/shared/components/Loader.vue'

const route = useRoute()
const moviesStore = useMoviesStore()
const cinemasStore = useCinemasStore()

const movieId = computed(() => parseInt(route.params.id as string))
const movie = computed(() => moviesStore.currentMovie)
const sessions = computed(() => moviesStore.movieSessions || [])
const cinemas = computed(() => cinemasStore.cinemas || [])

const loading = ref(true)
const error = ref<string | null>(null)

const fetchMovieData = async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([
      moviesStore.fetchMovieById(movieId.value),
      moviesStore.fetchMovieSessions(movieId.value),
      cinemasStore.fetchCinemas()
    ])
    if (!movie.value) {
      error.value = 'Фильм не найден'
    }
  } catch (err) {
    const apiError = err as { data?: { message?: string }; message?: string }
    error.value = apiError?.data?.message || apiError?.message || 'Ошибка при загрузке данных фильма'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMovieData()
})

watch(() => route.params.id, () => {
  fetchMovieData()
})
</script>
