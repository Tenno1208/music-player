<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  isArtist: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="mb-8">
    <!-- Header Section -->
    <div class="flex items-end justify-between mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer tracking-tight">
        {{ title }}
      </h2>
      <button class="text-xs font-bold text-zinc-400 hover:text-white transition-colors px-3 py-1 bg-white/5 rounded-full border border-white/5">
        Lihat semua
      </button>
    </div>
    
    <!-- Horizontal Scrollable Row -->
    <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0 scroll-smooth">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex-shrink-0 w-[140px] sm:w-[180px] bg-zinc-900/40 hover:bg-zinc-800/60 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 group relative border border-white/5"
      >
        <!-- Image Container -->
        <div class="relative w-full aspect-square mb-3 sm:mb-4 bg-zinc-950 shadow-lg overflow-hidden"
             :class="isArtist ? 'rounded-full' : 'rounded-xl'">
          <img
            :src="item.image"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Cover"
            loading="lazy"
          >
          <!-- Play Button Overlay -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-600 text-white flex items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-rose-600/30">
              <Icon name="solar:play-bold" class="w-5 h-5 ml-0.5" />
            </div>
          </div>
        </div>

        <!-- Text Info -->
        <div class="text-center" :class="{ 'text-left': !isArtist }">
          <h3 class="font-bold text-xs sm:text-sm text-zinc-100 truncate group-hover:text-rose-400 transition-colors mb-0.5">
            {{ item.name }}
          </h3>
          <p class="text-[10px] sm:text-xs text-zinc-500 truncate font-medium">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Menghilangkan scrollbar bawaan browser agar tetap rapi tapi bisa di-scroll */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>