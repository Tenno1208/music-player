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
    class="fixed bottom-0 left-0 w-full bg-zinc-950/95 backdrop-blur-md border-t border-white/5 z-50 transition-all duration-300 shadow-2xl shadow-black/50"
  >

    <!-- MOBILE -->
    <div class="md:hidden px-3 py-2 cursor-pointer" @click="player.isModalOpen = true">
      <div class="flex items-center gap-3">
        <img
          :src="player.currentTrack.snippet?.thumbnails?.default?.url"
          class="w-12 h-12 rounded-lg object-cover"
          alt="Cover"
        >
        <div class="flex-1 min-w-0">
          <p class="text-white text-sm font-medium truncate">
            {{ player.currentTrack.snippet?.title }}
          </p>
          <p class="text-zinc-400 text-xs truncate">
            {{ player.currentTrack.snippet?.channelTitle }}
          </p>
        </div>
        <button @click.stop="player.togglePlay()" class="text-white">
          <Icon
            :name="player.isPlaying ? 'solar:pause-circle-bold' : 'solar:play-circle-bold'"
            class="w-10 h-10"
          />
        </button>
      </div>
      <!-- Progress -->
      <div class="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div class="h-full bg-rose-500 transition-all duration-300" :style="{ width: `${progressPercentage}%` }"></div>
      </div>
    </div>

    <!-- DESKTOP -->
    <div class="hidden md:flex h-20 px-4 items-center justify-between">
      <!-- Left -->
      <div class="flex items-center gap-4 w-[30%] min-w-[220px] group cursor-pointer" @click="player.isModalOpen = true">
        <div class="relative w-14 h-14 rounded-md overflow-hidden bg-zinc-900 flex-shrink-0">
          <img
            :src="player.currentTrack.snippet?.thumbnails?.default?.url"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt="Cover"
          >
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Icon name="solar:alt-arrow-up-bold" class="w-6 h-6 text-white" />
          </div>
        </div>
        <div class="min-w-0 flex flex-col justify-center">
          <h4 class="text-sm font-semibold text-white truncate group-hover:underline">
            {{ player.currentTrack.snippet?.title }}
          </h4>
          <p class="text-xs text-zinc-400 truncate group-hover:underline">
            {{ player.currentTrack.snippet?.channelTitle }}
          </p>
        </div>
        <button @click.stop class="text-zinc-400 hover:text-rose-500 transition ml-2">
          <Icon name="solar:heart-bold" class="w-5 h-5" />
        </button>
      </div>

      <!-- Center -->
      <div class="flex flex-col items-center justify-center flex-1 max-w-xl">
        <div class="flex items-center gap-5">
          <button class="text-zinc-400 hover:text-white">
            <Icon name="solar:shuffle-bold" class="w-5 h-5" />
          </button>
          <button class="text-zinc-400 hover:text-white">
            <Icon name="solar:skip-previous-bold" class="w-6 h-6" />
          </button>
          <button
            @click="player.togglePlay()"
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Icon
              :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'"
              class="w-5 h-5"
              :class="{'ml-0.5': !player.isPlaying}"
            />
          </button>
          <button class="text-zinc-400 hover:text-white">
            <Icon name="solar:skip-next-bold" class="w-6 h-6" />
          </button>
          <button class="text-zinc-400 hover:text-white">
            <Icon name="solar:repeat-bold" class="w-5 h-5" />
          </button>
        </div>

        <div class="w-full flex items-center gap-2 mt-2">
          <span class="text-[11px] text-zinc-500 w-8 text-right">{{ formatTime(player.currentTime) }}</span>
          <div
            class="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden group cursor-pointer relative"
            @click="handleSeek"
          >
            <div
              class="h-full bg-zinc-300 group-hover:bg-rose-500 relative transition-all duration-300 ease-linear"
              :style="{ width: `${progressPercentage}%` }"
            >
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow scale-110"></div>
            </div>
          </div>
          <span class="text-[11px] text-zinc-500 w-8">{{ formatTime(player.duration) }}</span>
        </div>
      </div>

      <!-- Right -->
      <div class="w-[30%] min-w-[220px] flex items-center justify-end gap-4">
        <button class="text-zinc-400 hover:text-white">
          <Icon name="solar:microphone-2-bold" class="w-5 h-5" />
        </button>
        <button class="text-zinc-400 hover:text-white">
          <Icon name="solar:list-bold" class="w-5 h-5" />
        </button>
        <button class="text-zinc-400 hover:text-white">
          <Icon name="solar:devices-bold" class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-2 w-24">
          <Icon name="solar:volume-loud-bold" class="w-5 h-5 text-zinc-400" />
          <div class="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden group cursor-pointer">
            <div class="h-full w-2/3 bg-zinc-300 group-hover:bg-rose-500"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>