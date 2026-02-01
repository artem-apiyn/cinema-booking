<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-white-mist mb-8">Кинотеатры</h1>
    
    <div v-if="loading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton v-for="i in 6" :key="i" height="200px" />
      </div>
    </div>
    
    <CinemaList v-else-if="cinemas && cinemas.length > 0" :cinemas="cinemas" />
    
    <div v-else class="text-center py-12">
      <p class="text-grey-text">Кинотеатры не найдены</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCinemasStore } from '~/stores/cinemas'
import CinemaList from '~/features/cinemas/components/CinemaList.vue'
import Skeleton from '~/shared/components/Skeleton.vue'

const cinemasStore = useCinemasStore()
const cinemas = computed(() => cinemasStore.cinemas ?? [])
const loading = ref(true)

onMounted(async () => {
  try {
    await cinemasStore.fetchCinemas()
  } finally {
    loading.value = false
  }
})
</script>
