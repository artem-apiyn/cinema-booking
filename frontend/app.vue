<template>
  <NuxtLayout>
    <NuxtPage />
    <NuxtErrorBoundary>
      <template #error="{ error }">
        <div class="min-h-screen bg-deep-void flex items-center justify-center">
          <div class="container mx-auto px-4 text-center">
            <div class="max-w-md mx-auto">
              <h1 class="text-9xl font-bold text-cinema-rose mb-4">500</h1>
              <h2 class="text-3xl font-bold text-white-mist mb-4">Произошла ошибка</h2>
              <p class="text-grey-text mb-8">{{ error.message || 'Что-то пошло не так.' }}</p>
              <button
                class="px-4 py-2 bg-cinema-rose text-white-mist rounded-lg hover:bg-cinema-rose-hover"
                @click="clearError()"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </template>
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>