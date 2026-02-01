<template>
  <div class="flex gap-6 justify-center flex-wrap">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 border-2 border-grey-text rounded"/>
      <span class="text-sm text-grey-text">Свободно</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-cinema-rose rounded shadow-glow"/>
      <span class="text-sm text-grey-text">Выбрано</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-disabled rounded opacity-50 relative">
        <svg class="w-full h-full text-white-mist" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
      <span class="text-sm text-grey-text">Занято</span>
    </div>
  </div>
</template>
