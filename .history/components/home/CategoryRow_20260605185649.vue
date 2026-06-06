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
    <div class="flex items-end justify-between mb-4">
      <h2 class="text-2xl font-bold text-white hover:underline cursor-pointer">{{ title }}</h2>
      <span class="text-sm font-bold text-zinc-400 hover:underline cursor-pointer">Show all</span>
    </div>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="bg-[#181818] hover:bg-[#282828] p-4 rounded-md cursor-pointer transition-colors group relative"
      >
        <div class="relative mb-4 pb-[100%]">
          <img
            :src="item.image"
            class="absolute top-0 left-0 w-full h-full object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            :class="isArtist ? 'rounded-full' : 'rounded-md'"
            alt="Cover"
          >
          <div class="absolute bottom-2 right-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button class="w-12 h-12 rounded-full bg-rose-500 text-black flex items-center justify-center hover:scale-105 hover:bg-rose-400 shadow-xl">
              <Icon name="solar:play-bold" class="w-6 h-6 ml-1" />
            </button>
          </div>
        </div>
        <h3 class="font-bold text-white truncate mb-1">{{ item.name }}</h3>
        <p class="text-sm text-zinc-400 line-clamp-2">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>