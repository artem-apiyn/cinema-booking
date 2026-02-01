import { vi } from 'vitest'
import { ref, computed, readonly as vueReadonly } from 'vue'

global.defineNuxtPlugin = vi.fn()
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBase: 'http://localhost:3022'
  }
}))
global.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn()
}))
global.navigateTo = vi.fn()
global.useState = vi.fn((key, init) => {
  const state = ref(init ? init() : null)
  return state
})
// Use the real Vue readonly instead of mocking it
global.readonly = vueReadonly

global.useAuthStore = vi.fn(() => ({
  user: ref(null),
  token: ref(null),
  isAuthenticated: computed(() => false),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn()
}))

global.useMoviesStore = vi.fn(() => ({
  movies: ref([]),
  currentMovie: ref(null),
  movieSessions: ref([]),
  fetchMovies: vi.fn(),
  fetchMovieById: vi.fn(),
  fetchMovieSessions: vi.fn()
}))

global.useCinemasStore = vi.fn(() => ({
  cinemas: ref([]),
  currentCinema: ref(null),
  cinemaSessions: ref([]),
  fetchCinemas: vi.fn(),
  fetchCinemaById: vi.fn(),
  fetchCinemaSessions: vi.fn()
}))

global.useBookingsStore = vi.fn(() => ({
  bookings: ref([]),
  settings: ref(null),
  unpaidBookings: computed(() => []),
  upcomingBookings: computed(() => []),
  pastBookings: computed(() => []),
  fetchBookings: vi.fn(),
  fetchSettings: vi.fn(),
  createBooking: vi.fn(),
  payBooking: vi.fn()
}))

global.useToast = vi.fn(() => ({
  toasts: ref([]),
  showToast: vi.fn(),
  removeToast: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}))

global.useApi = vi.fn(() => ({
  apiFetch: vi.fn()
}))

global.$fetch = vi.fn()
