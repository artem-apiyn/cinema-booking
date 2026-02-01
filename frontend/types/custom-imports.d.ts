declare global {
  const useToast: typeof import('~/app/shared/composables/useToast').useToast
  const useApi: typeof import('~/app/shared/composables/useApi').useApi
  const useAuthStore: typeof import('~/app/stores/auth').useAuthStore
  const useBookingsStore: typeof import('~/app/stores/bookings').useBookingsStore
  const useCinemasStore: typeof import('~/app/stores/cinemas').useCinemasStore
  const useMoviesStore: typeof import('~/app/stores/movies').useMoviesStore
}

export {}
