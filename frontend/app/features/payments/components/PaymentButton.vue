<template>
  <Button
    :loading="loading"
    :disabled="disabled"
    size="md"
    variant="primary"
    :class="[
      'payment-button',
      'font-semibold',
      'hover:scale-105',
      'active:scale-95',
      'transition-transform',
      'duration-200',
      'rounded-xl',
      'p-4'
    ]"
    @click="handlePayment"
  >
    <span class="flex items-center gap-2">
      <span>Оплатить</span>
    </span>
  </Button>
</template>

<script setup lang="ts">
import { useBookingsStore } from '~/stores/bookings'
import { useToast } from '~/shared/composables/useToast'

interface Props {
  bookingId: string
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  paid: []
}>()

const bookingsStore = useBookingsStore()
const toast = useToast()
const loading = ref(props.loading)

const handlePayment = async () => {
  loading.value = true
  try {
    await bookingsStore.payBooking(props.bookingId)
    toast.success('Бронирование успешно оплачено')
    emit('paid')
  } catch (error: unknown) {
    const apiError = error as { data?: { message?: string } }
    const message = apiError?.data?.message || 'Ошибка при оплате'
    toast.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.payment-button {
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.payment-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.payment-button:hover::before {
  left: 100%;
}

.payment-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
</style>
