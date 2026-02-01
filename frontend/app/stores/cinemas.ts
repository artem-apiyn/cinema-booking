import { defineStore } from 'pinia'
import type { Cinema, MovieSession } from '~/shared/types/api.types'
import { useApi } from '~/shared/composables/useApi'

export const useCinemasStore = defineStore('cinemas', () => {
  const cinemas = ref<Cinema[]>([])
  const currentCinema = ref<Cinema | null>(null)
  const cinemaSessions = ref<MovieSession[]>([])

  async function fetchCinemas() {
    try {
      const { apiFetch } = useApi()
      const result = await apiFetch<Cinema[]>('/cinemas')
      cinemas.value = result || []
      return cinemas.value
    } catch (error) {
      cinemas.value = []
      throw error
    }
  }

  async function fetchCinemaById(id: number) {
    try {
      if (cinemas.value.length > 0) {
        currentCinema.value = cinemas.value.find(c => c.id === id) || null
        if (currentCinema.value) {
          return currentCinema.value
        }
      }
      const allCinemas = await fetchCinemas()
      currentCinema.value = allCinemas.find(c => c.id === id) || null
      return currentCinema.value
    } catch (error) {
      currentCinema.value = null
      throw error
    }
  }

  async function fetchCinemaSessions(cinemaId: number) {
    const { apiFetch } = useApi()
    cinemaSessions.value = await apiFetch<MovieSession[]>(`/cinemas/${cinemaId}/sessions`)
    return cinemaSessions.value
  }

  return {
    cinemas: readonly(cinemas),
    currentCinema: readonly(currentCinema),
    cinemaSessions: readonly(cinemaSessions),
    fetchCinemas,
    fetchCinemaById,
    fetchCinemaSessions
  }
})
