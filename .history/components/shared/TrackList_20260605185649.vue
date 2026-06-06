<script setup>
import { usePlayerStore } from '~/stores/player'

defineProps({
  tracks: {
    type: Array,
    required: true
  }
})

const player = usePlayerStore()
</script>

<template>
  <div>
    <div class="flex items-center text-sm text-zinc-400 border-b border-white/5 pb-2 mb-4 px-4">
      <div class="w-8 text-center">#</div>
      <div class="flex-1">Title</div>
      <div class="w-32 hidden sm:block">Album</div>
      <div class="w-32 hidden md:block">Date added</div>
      <div class="w-16 text-center"><Icon name="solar:clock-circle-bold" class="w-4 h-4 mx-auto" /></div>
    </div>

    <div class="space-y-1">
      <div
        v-for="(track, index) in tracks"
        :key="track.id.videoId"
        @click="player.playTrack(track)"
        class="flex items-center text-sm px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer transition-colors"
      >
        <div class="w-8 text-center text-zinc-400 group-hover:hidden">{{ index + 1 }}</div>
        <div class="w-8 text-center hidden group-hover:flex items-center justify-center">
          <Icon name="solar:play-bold" class="w-4 h-4 text-white" />
        </div>
        
        <div class="flex-1 flex items-center gap-3 min-w-0 pr-4">
          <img :src="track.snippet?.thumbnails?.default?.url" class="w-10 h-10 object-cover rounded bg-zinc-800 flex-shrink-0" />
          <div class="min-w-0 flex flex-col">
            <span class="text-white font-medium truncate group-hover:text-rose-400" :class="{'text-rose-500': player.currentTrack?.id?.videoId === track.id?.videoId}">
              {{ track.snippet?.title }}
            </span>
            <span class="text-zinc-400 text-xs truncate hover:underline">{{ track.snippet?.channelTitle }}</span>
          </div>
        </div>
        
        <div class="w-32 hidden sm:block text-zinc-400 text-xs truncate pr-4 hover:underline">
          {{ track.snippet?.channelTitle }} - Single
        </div>
        <div class="w-32 hidden md:block text-zinc-400 text-xs truncate">
          Oct 23, 2023
        </div>
        <div class="w-16 flex items-center justify-end gap-3 text-zinc-400">
          <Icon name="solar:heart-linear" class="w-4 h-4 opacity-0 group-hover:opacity-100 hover:text-white" />
          <span class="text-xs">3:45</span>
        </div>
      </div>
    </div>
  </div>
</template>