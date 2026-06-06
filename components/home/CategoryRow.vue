<template>
  <div class="mb-8">
    <div class="flex items-center justify-between mb-4 px-4 sm:px-0">
      <h2 class="text-lg sm:text-2xl font-bold text-white hover:underline cursor-pointer tracking-tight">
        {{ title }}
      </h2>
      <button class="text-xs font-bold text-zinc-400 hover:text-white transition-all px-3 py-1.5 bg-zinc-900 sm:bg-white/5 rounded-full border border-white/5 active:scale-95">
        Lihat semua
      </button>
    </div>
    
    <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex-shrink-0 w-[135px] sm:w-[180px] bg-zinc-900/40 hover:bg-zinc-800/60 p-3 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 group relative border border-white/5 snap-start"
      >
        <div class="relative w-full aspect-square mb-3 bg-zinc-950 shadow-lg overflow-hidden"
             :class="isArtist ? 'rounded-full' : 'rounded-lg sm:rounded-xl'">
          <img
            :src="item.image"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Cover"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-black/40 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-600 text-white flex items-center justify-center transform translate-y-3 sm:group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-rose-600/30">
              <Icon name="solar:play-bold" class="w-5 h-5 ml-0.5" />
            </div>
          </div>
        </div>

        <div class="text-center" :class="{ 'sm:text-left': !isArtist }">
          <h3 class="font-bold text-xs sm:text-sm text-zinc-100 truncate sm:group-hover:text-rose-400 transition-colors mb-0.5">
            {{ item.name }}
          </h3>
          <p class="text-[10px] sm:text-xs text-zinc-500 truncate font-medium">
            {{ item.description || 'Artist' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  isArtist: { type: Boolean, default: false }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>