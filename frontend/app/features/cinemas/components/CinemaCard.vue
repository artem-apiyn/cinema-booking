<template>
  <Card hover custom-class="cursor-pointer" @click="navigateToDetail">
    <h3 class="text-xl font-bold text-white-mist mb-2">{{ cinema.name }}</h3>
    <p class="text-grey-text mb-4">{{ cinema.address }}</p>
    <Button size="sm" @click.stop="navigateToDetail">
      Просмотреть сеансы
    </Button>
  </Card>
</template>

<script setup lang="ts">
import type { Cinema } from '~/shared/types/api.types'
import Card from '~/shared/components/Card.vue'
import Button from '~/shared/components/Button.vue'

interface Props {
  cinema: Cinema
}

const props = defineProps<Props>()

const navigateToDetail = () => {
  navigateTo(`/cinemas/${props.cinema.id}`)
}
</script>
