<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const progressPercentage = computed(() => {
  if (!player.duration) return 0
  return (player.currentTime / player.duration) * 100
})

// Perhitungan matematika keliling lingkaran SVG (2 * pi * r) untuk Progress Foto
const strokeDashoffset = computed(() => {
  const circumference = 2 * Math.PI * 22
  return circumference - (progressPercentage.value / 100) * circumference
})

const handleSeek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  player.seekTo(percentage * player.duration)
}
</script>

<template>
  <div
    v-if="player.currentTrack"
    class="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-[calc(256px+16px)] md:right-4 bg-[#121212]/90 backdrop-blur-xl border border-white/5 z-40 rounded-[28px] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
  >

    <div class="md:hidden px-4 py-3 cursor-pointer" @click="player.isModalOpen = true">
      <div class="flex items-center justify-between gap-3">
        
        <div class="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 48 48">
            <circle 
              cx="24" cy="24" r="22" 
              stroke="rgba(255, 255, 255, 0.1)" 
              stroke-width="2.5" 
              fill="transparent" 
            />
            <circle 
              cx="24" cy="24" r="22" 
              stroke="#ffffff" 
              stroke-width="2.5" 
              fill="transparent"
              stroke-linecap="round"
              :stroke-dasharray="2 * Math.PI * 22"
              :stroke-dashoffset="strokeDashoffset"
              class="transition-all duration-300 ease-linear"
            />
          </svg>
          
          <img
            :src="player.currentTrack.snippet?.thumbnails?.default?.url"
            class="w-[38px] h-[38px] rounded-full object-cover z-10"
            alt="Cover"
          >
        </div>
        
        <div class="flex-1 min-w-0 pr-1 pl-1">
          <p class="text-white text-sm font-semibold truncate">
            {{ player.currentTrack.snippet?.title }}
          </p>
          <p class="text-zinc-400 text-xs truncate mt-0.5">
            {{ player.currentTrack.snippet?.channelTitle }}
          </p>
        </div>
        
        <div class="flex items-center gap-2 flex-shrink-0" @click.stop>
          <button 
            @click="player.togglePlay()" 
            class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 active:scale-90 transition-transform"
          >
            <Icon
              :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'"
              class="w-4 h-4"
              :class="{'ml-0.5': !player.isPlaying}"
            />
          </button>
          
          <button 
            class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-300 hover:text-rose-500 active:scale-90 transition-all"
          >
            <Icon name="solar:heart-linear" class="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>

    <div class="hidden md:flex h-20 px-6 items-center justify-between">
      <div class="flex items-center gap-4 w-[30%] min-w-[220px] group cursor-pointer" @click="player.isModalOpen = true">
        <div class="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-950 flex-shrink-0 shadow-md">
          <img
            :src="player.currentTrack.snippet?.thumbnails?.default?.url"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt="Cover"
          >
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Icon name="solar:alt-arrow-up-bold" class="w-5 h-5 text-white" />
          </div>
        </div>
        <div class="min-w-0 flex flex-col justify-center">
          <h4 class="text-sm font-semibold text-zinc-100 truncate group-hover:text-rose-400 transition-colors">
            {{ player.currentTrack.snippet?.title }}
          </h4>
          <p class="text-xs text-zinc-400 truncate mt-0.5">
            {{ player.currentTrack.snippet?.channelTitle }}
          </p>
        </div>
        <button @click.stop class="text-zinc-500 hover:text-rose-500 transition-colors ml-4 flex-shrink-0">
          <Icon name="solar:heart-bold" class="w-5 h-5" />
        </button>
      </div>

      <div class="flex flex-col items-center justify-center flex-1 max-w-xl px-4">
        <div class="flex items-center gap-6">
          <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:shuffle-bold" class="w-4 h-4" /></button>
          <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:skip-previous-bold" class="w-5 h-5" /></button>
          <button
            @click="player.togglePlay()"
            class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
          >
            <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-4 h-4" :class="{'ml-0.5': !player.isPlaying}" />
          </button>
          <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:skip-next-bold" class="w-5 h-5" /></button>
          <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:repeat-bold" class="w-4 h-4" /></button>
        </div>

        <div class="w-full flex items-center gap-3 mt-2.5">
          <span class="text-[10px] text-zinc-500 w-8 text-right font-medium tracking-tight">{{ formatTime(player.currentTime) }}</span>
          <div class="flex-1 h-1 bg-white/10 group-hover:h-1.5 rounded-full overflow-hidden group cursor-pointer relative transition-all" @click="handleSeek">
            <div class="h-full bg-white group-hover:bg-rose-500 relative transition-all duration-100 ease-linear" :style="{ width: `${progressPercentage}%` }">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow scale-110"></div>
            </div>
          </div>
          <span class="text-[10px] text-zinc-500 w-8 font-medium tracking-tight">{{ formatTime(player.duration) }}</span>
        </div>
      </div>

      <div class="w-[30%] min-w-[220px] flex items-center justify-end gap-4">
        <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:microphone-2-bold" class="w-4 h-4" /></button>
        <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:list-bold" class="w-4 h-4" /></button>
        <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:devices-bold" class="w-4 h-4" /></button>
        <div class="flex items-center gap-2 w-20">
          <Icon name="solar:volume-loud-bold" class="w-4 h-4 text-zinc-400" />
          <div class="flex-1 h-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer">
            <div class="h-full w-2/3 bg-zinc-300 group-hover:bg-rose-500 transition-colors"></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>