<script setup>
defineProps({
  title: String,
  tracks: Array
})

const player = usePlayerStore()
</script>

<template>
  <div class="mb-8">
    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <slot name="icon"></slot>
      {{ title }}
    </h3>
    
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="track in tracks"
        :key="track.id?.videoId || track.id"
        @click="player.playTrack(track)"
        class="group cursor-pointer"
      >
        <div class="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
          <img :src="track.snippet?.thumbnails?.high?.url" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        </div>
        <div class="mt-2">
          <h4 class="font-semibold text-xs text-zinc-200 truncate">{{ track.snippet?.title }}</h4>
          <p class="text-[10px] text-zinc-500 truncate">{{ track.snippet?.channelTitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>