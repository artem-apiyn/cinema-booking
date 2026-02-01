<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
    <div v-else-if="error" class="text-center py-12">
      <p class="text-grey-text">{{ error }}</p>
    </div>
    <CinemaDetail
      v-else-if="cinema"
      :cinema="cinema"
      :sessions="sessions"
    />
    <div v-else class="text-center py-12">
      <p class="text-grey-text">Кинотеатр не найден</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCinemasStore } from '~/stores/cinemas'
import { useMoviesStore } from '~/stores/movies'
import CinemaDetail from '~/features/cinemas/components/CinemaDetail.vue'
import Loader from '~/shared/components/Loader.vue'

const route = useRoute()
const cinemasStore = useCinemasStore()
const moviesStore = useMoviesStore()

const cinemaId = computed(() => parseInt(route.params.id as string))
const cinema = computed(() => cinemasStore.currentCinema)
const sessions = computed(() => cinemasStore.cinemaSessions || [])

const loading = ref(true)
const error = ref<string | null>(null)

const fetchCinemaData = async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([
      cinemasStore.fetchCinemaById(cinemaId.value),
      cinemasStore.fetchCinemaSessions(cinemaId.value),
      moviesStore.fetchMovies()
    ])
    if (!cinema.value) {
      error.value = 'Кинотеатр не найден'
    }
  } catch (err) {
    const apiError = err as { data?: { message?: string }; message?: string }
    error.value = apiError?.data?.message || apiError?.message || 'Ошибка при загрузке данных кинотеатра'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCinemaData()
})

watch(() => route.params.id, () => {
  fetchCinemaData()
})
</script>
