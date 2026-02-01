<template>
  <div class="bg-surface rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-elevated">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold text-white-mist">
              {{ showMovies ? 'Название фильма' : 'Кинотеатр' }}
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-white-mist">Дата</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-white-mist">Время</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-white-mist">Цена</th>
            <th class="px-6 py-4 text-right text-sm font-semibold text-white-mist">Действие</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-elevated">
          <tr
            v-for="session in groupedSessions"
            :key="`${session.cinemaId}-${session.id}`"
            class="hover:bg-elevated/50 transition-colors"
          >
            <td class="px-6 py-4 text-white-mist">
              {{ showMovies ? getMovieTitle(session.movieId) : getCinemaName(session.cinemaId) }}
            </td>
            <td class="px-6 py-4 text-grey-text">{{ formatDate(session.startTime) }}</td>
            <td class="px-6 py-4 text-grey-text">{{ formatTime(session.startTime) }}</td>
            <td class="px-6 py-4 text-white-mist font-medium">{{ formatPrice(500) }}</td>
            <td class="px-6 py-4 text-right">
              <Button
                size="sm"
                @click="navigateToBooking(session.id)"
              >
                Забронировать
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieSession, Cinema, Movie } from '~/shared/types/api.types'
import { useFormat } from '~/shared/composables/useFormat'
import Button from '~/shared/components/Button.vue'

interface Props {
  sessions: readonly MovieSession[]
  cinemas?: readonly Cinema[]
  movies?: readonly Movie[]
  showMovies?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cinemas: () => [],
  movies: () => [],
  showMovies: false
})

const { formatDate, formatTime, formatPrice } = useFormat()

const groupedSessions = computed(() => {
  return [...props.sessions].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  })
})

const getCinemaName = (cinemaId: number): string => {
  const cinema = props.cinemas.find(c => c.id === cinemaId)
  return cinema?.name || 'Неизвестно'
}

const getMovieTitle = (movieId: number): string => {
  const movie = props.movies.find(m => m.id === movieId)
  return movie?.title || 'Неизвестно'
}

const navigateToBooking = (sessionId: number) => {
  navigateTo(`/sessions/${sessionId}/book`)
}
</script>
