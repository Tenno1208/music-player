<script setup>
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()
</script>

<template>
  <div v-if="player.currentTrack" class="h-20 bg-zinc-950 border-t border-white/5 px-4 flex items-center justify-between z-50 fixed bottom-0 left-0 right-0 md:left-64 flex-shrink-0">
    
    <!-- Track Info -->
    <div class="flex items-center gap-4 w-[30%] min-w-[180px]">
      <div class="relative w-14 h-14 rounded-md overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10">
        <img
          :src="player.currentTrack.snippet?.thumbnails?.default?.url"
          class="w-full h-full object-cover"
          alt="Cover"
        >
      </div>
      <div class="min-w-0 flex flex-col justify-center">
        <h4 class="text-sm font-bold text-white truncate hover:underline cursor-pointer">
          {{ player.currentTrack.snippet?.title }}
        </h4>
        <p class="text-xs text-zinc-400 truncate hover:underline cursor-pointer mt-0.5">
          {{ player.currentTrack.snippet?.channelTitle }}
        </p>
      </div>
      <button class="text-zinc-400 hover:text-white ml-2">
        <Icon name="solar:heart-bold" class="w-5 h-5" />
      </button>
    </div>

    <!-- Controls -->
    <div class="flex flex-col items-center justify-center max-w-[40%] flex-1">
      <div class="flex items-center gap-6">
        <button class="text-zinc-400 hover:text-white transition-colors">
          <Icon name="solar:shuffle-bold" class="w-5 h-5" />
        </button>
        <button class="text-zinc-400 hover:text-white transition-colors">
          <Icon name="solar:skip-previous-bold" class="w-6 h-6" />
        </button>
        <button
          @click="player.togglePlay()"
          class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-6 h-6" :class="{'ml-1': !player.isPlaying}" />
        </button>
        <button class="text-zinc-400 hover:text-white transition-colors">
          <Icon name="solar:skip-next-bold" class="w-6 h-6" />
        </button>
        <button class="text-zinc-400 hover:text-white transition-colors">
          <Icon name="solar:repeat-bold" class="w-5 h-5" />
        </button>
      </div>
      <!-- Mock Progress Bar -->
      <div class="w-full flex items-center gap-2 mt-2">
        <span class="text-[11px] text-zinc-400">1:03</span>
        <div class="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden group cursor-pointer">
          <div class="h-full bg-zinc-300 group-hover:bg-rose-500 w-1/3 relative">
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow"></div>
          </div>
        </div>
        <span class="text-[11px] text-zinc-400">3:45</span>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="w-[30%] min-w-[180px] flex items-center justify-end gap-3 pr-2">
      <button class="text-zinc-400 hover:text-white transition-colors hidden sm:block">
        <Icon name="solar:microphone-2-bold" class="w-5 h-5" />
      </button>
      <button class="text-zinc-400 hover:text-white transition-colors hidden sm:block">
        <Icon name="solar:list-bold" class="w-5 h-5" />
      </button>
      <button class="text-zinc-400 hover:text-white transition-colors hidden sm:block">
        <Icon name="solar:devices-bold" class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2 w-24">
        <Icon name="solar:volume-loud-bold" class="text-zinc-400 w-5 h-5" />
        <div class="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden group cursor-pointer">
          <div class="h-full bg-zinc-300 group-hover:bg-rose-500 w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Hidden YouTube Player -->
    <iframe
      v-if="player.currentTrack && player.isPlaying"
      :src="`https://www.youtube.com/embed/${player.currentTrack.id.videoId}?autoplay=1&enablejsapi=1`"
      allow="autoplay"
      class="fixed opacity-0 pointer-events-none w-0 h-0"
    />
  </div>
</template>