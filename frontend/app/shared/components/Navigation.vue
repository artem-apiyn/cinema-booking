<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="flex items-center justify-between w-full">
    <NuxtLink to="/movies" class="text-2xl font-bold text-white-mist hover:text-cinema-rose transition-colors">
      CINEMA
    </NuxtLink>

    <div class="hidden md:flex items-center gap-6">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'px-3 py-2 text-sm font-medium transition-colors relative',
          isActive(item.to)
            ? 'text-cinema-rose'
            : 'text-grey-text hover:text-white-mist'
        ]"
      >
        {{ item.label }}
        <span
          v-if="isActive(item.to)"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-cinema-rose"
        />
      </NuxtLink>

      <Button
        v-if="!isAuthenticated"
        size="sm"
        @click="navigateTo('/login')"
      >
        Войти
      </Button>

      <button
        v-else
        class="px-3 py-2 text-sm font-medium text-grey-text hover:text-white-mist transition-colors"
        @click="handleLogout"
      >
        Выход
      </button>
    </div>

    <button
      class="md:hidden text-white-mist p-2"
      aria-label="Переключить меню"
      @click="mobileMenuOpen = !mobileMenuOpen"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          v-if="!mobileMenuOpen"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <Transition name="slide-down">
      <div
        v-if="mobileMenuOpen"
        class="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-md border-b border-elevated md:hidden z-50"
      >
        <div class="flex flex-col p-4 space-y-2">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'text-cinema-rose bg-elevated'
                : 'text-grey-text hover:text-white-mist hover:bg-elevated'
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>

          <Button
            v-if="!isAuthenticated"
            size="sm"
            class="w-full"
            @click="navigateTo('/login'); mobileMenuOpen = false"
          >
            Войти
          </Button>

          <button
            v-else
            class="px-4 py-2 rounded-lg text-sm font-medium text-grey-text hover:text-white-mist hover:bg-elevated transition-colors text-left"
            @click="handleLogout(); mobileMenuOpen = false"
          >
            Выход
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/features/auth/composables/useAuth'
import Button from '~/shared/components/Button.vue'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()

const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const menuItems = computed(() => [
  { label: 'Фильмы', to: '/movies' },
  { label: 'Кинотеатры', to: '/cinemas' },
  ...(isAuthenticated.value ? [{ label: 'Мои билеты', to: '/my-tickets' }] : [])
])

const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = () => {
  logout()
  mobileMenuOpen.value = false
}

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
