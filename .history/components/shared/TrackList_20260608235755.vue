<template>
  <div>
    <div class="hidden sm:flex items-center text-xs font-semibold text-zinc-400 border-b border-white/5 pb-2 mb-3 px-4 uppercase tracking-wider">
      <div class="w-8 text-center">#</div>
      <div class="flex-1">Title</div>
      <div class="w-32 md:w-40">Album</div>
      <div class="w-32 hidden md:block">Date added</div>
      <div class="w-16 text-center"><Icon name="solar:clock-circle-bold" class="w-4 h-4 mx-auto" /></div>
    </div>

    <div class="space-y-0.5">
      <div
        v-for="(track, index) in tracks"
        :key="track.id?.videoId || index"
        @click="playSong(track)"
        class="flex items-center text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-white/10 active:bg-white/5 group cursor-pointer transition-colors min-w-0"
      >
        <div class="w-6 sm:w-8 text-center text-zinc-400 flex-shrink-0">
          <span class="sm:group-hover:hidden text-xs sm:text-sm">{{ index + 1 }}</span>
          <Icon name="solar:play-bold" class="w-3.5 h-3.5 text-white mx-auto hidden sm:group-hover:block" />
        </div>
        
        <div class="flex-1 flex items-center gap-3 min-w-0 pr-2">
          <img 
            :src="track.snippet?.thumbnails?.default?.url || track.snippet?.thumbnails?.medium?.url" 
            class="w-10 h-10 object-cover rounded-md bg-zinc-800 flex-shrink-0 shadow" 
            alt="Track Thumb"
          />
          <div class="min-w-0 flex flex-col">
            <span 
              class="text-zinc-100 text-sm font-medium truncate group-hover:text-rose-400 transition-colors" 
              :class="{'text-rose-500 font-bold': player.currentTrack?.id?.videoId === track.id?.videoId}"
            >
              {{ track.snippet?.title }}
            </span>
            <span class="text-zinc-400 text-xs truncate hover:underline mt-0.5">{{ track.snippet?.channelTitle }}</span>
          </div>
        </div>
        
        <div class="w-32 md:w-40 hidden sm:block text-zinc-400 text-xs truncate pr-4 hover:underline">
          {{ track.snippet?.channelTitle }} - Single
        </div>
        
        <div class="w-32 hidden md:block text-zinc-400 text-xs truncate">
          Oct 23, 2023
        </div>
        
        <div class="w-14 sm:w-16 flex items-center justify-end gap-2 sm:gap-3 text-zinc-400 flex-shrink-0">
          <Icon name="solar:heart-linear" class="w-4 h-4 opacity-0 sm:group-hover:opacity-100 hover:text-white transition-opacity hidden sm:block" />
          <span class="text-xs text-zinc-400">3:45</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '~/stores/player'

defineProps({
  tracks: { type: Array, required: true }
})

const player = usePlayerStore()
const props = defineProps({
  tracks: {
    type: Array,
    required: true
  }
})

const player = usePlayerStore()

const playSong = (track) => {
  player.setQueue(props.tracks)
  player.playTrack(track)
}
</script>