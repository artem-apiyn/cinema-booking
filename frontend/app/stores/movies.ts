import { defineStore } from 'pinia'
import type { Movie, MovieSession } from '~/shared/types/api.types'
import { useApi } from '~/shared/composables/useApi'

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref<Movie[]>([])
  const currentMovie = ref<Movie | null>(null)
  const movieSessions = ref<MovieSession[]>([])

  async function fetchMovies() {
    try {
      const { apiFetch } = useApi()
      const result = await apiFetch<Movie[]>('/movies')
      movies.value = result || []
      return movies.value
    } catch (error) {
      movies.value = []
      throw error
    }
  }

  async function fetchMovieById(id: number) {
    try {
      if (movies.value.length > 0) {
        currentMovie.value = movies.value.find(m => m.id === id) || null
        if (currentMovie.value) {
          return currentMovie.value
        }
      }
      const allMovies = await fetchMovies()
      currentMovie.value = allMovies.find(m => m.id === id) || null
      return currentMovie.value
    } catch (error) {
      currentMovie.value = null
      throw error
    }
  }

  async function fetchMovieSessions(movieId: number) {
    const { apiFetch } = useApi()
    movieSessions.value = await apiFetch<MovieSession[]>(`/movies/${movieId}/sessions`)
    return movieSessions.value
  }

  return {
    movies: readonly(movies),
    currentMovie: readonly(currentMovie),
    movieSessions: readonly(movieSessions),
    fetchMovies,
    fetchMovieById,
    fetchMovieSessions
  }
})
