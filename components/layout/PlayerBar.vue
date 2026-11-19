<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const trackTitle = computed(() => player.currentTrack?.title || player.currentTrack?.snippet?.title || 'Memutar Lagu')
const trackArtist = computed(() => player.currentTrack?.artist || player.currentTrack?.snippet?.channelTitle || 'Artis Tidak Diketahui')
const trackCover = computed(() =>
  player.currentTrack?.albumCover ||
  player.currentTrack?.artistImage ||
  player.currentTrack?.snippet?.thumbnails?.medium?.url ||
  player.currentTrack?.snippet?.thumbnails?.high?.url ||
  player.currentTrack?.snippet?.thumbnails?.default?.url ||
  ''
)

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const progressPercentage = computed(() => {
  if (!player.duration) return 0
  return Math.min(100, Math.max(0, (player.currentTime / player.duration) * 100))
})

const handleSeek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = Math.max(0, Math.min(1, clickX / rect.width))
  player.seek(percentage * player.duration)
}

const handleVolumeClick = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const v = Math.max(0, Math.min(1, clickX / rect.width))
  player.setVolume(v)
}
</script>

<template>
  <div v-if="player.currentTrack">
    
    <!-- ======================================================== -->
    <!-- MOBILE PLAYER (COMPACT FLOATING DOCK ABOVE NAV) -->
    <!-- ======================================================== -->
    <div
      class="md:hidden fixed bottom-20 left-3 right-3 h-16 bg-[#121216]/95 backdrop-blur-2xl border border-white/10 rounded-2xl z-40 px-3.5 flex items-center justify-between shadow-[0_12px_32px_rgba(0,0,0,0.8)] cursor-pointer overflow-hidden group select-none"
      @click="player.isModalOpen = true"
    >
      <!-- Subtle Progress Bar at the Top Border -->
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
        <div class="h-full bg-rose-500 transition-all duration-300 ease-linear" :style="{ width: `${progressPercentage}%` }"></div>
      </div>

      <!-- Track Thumbnail & Info -->
      <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
        <div class="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10">
          <img
            v-if="trackCover"
            :src="trackCover"
            class="w-full h-full object-cover"
            alt="Album Cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
            <Icon name="solar:music-note-bold" class="w-5 h-5" />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold text-white truncate">
            {{ trackTitle }}
          </p>
          <p class="text-[11px] text-zinc-400 truncate mt-0.5">
            {{ trackArtist }}
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-1.5 flex-shrink-0" @click.stop>
        <button
          @click="player.toggleLike(player.currentTrack)"
          class="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-zinc-400 hover:text-white active:scale-90"
        >
          <Icon
            :name="player.isLiked(player.currentTrack) ? 'solar:heart-bold' : 'solar:heart-linear'"
            class="w-4 h-4"
            :class="player.isLiked(player.currentTrack) ? 'text-rose-500' : ''"
          />
        </button>

        <button
          @click="player.togglePlay()"
          class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-transform shadow-md"
        >
          <Icon
            :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'"
            class="w-4 h-4"
            :class="{ 'ml-0.5': !player.isPlaying }"
          />
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- DESKTOP PLAYER BAR (FLUSH FULL-WIDTH STUDIO DOCK) -->
    <!-- ======================================================== -->
    <div
      class="hidden md:flex fixed bottom-0 left-0 right-0 md:left-64 h-20 bg-[#0a0a0c]/95 backdrop-blur-2xl border-t border-white/[0.08] z-50 px-6 items-center justify-between select-none shadow-[0_-8px_24px_rgba(0,0,0,0.5)]"
    >
      <!-- LEFT: Track Metadata -->
      <div class="flex items-center gap-3.5 w-1/4 min-w-[220px]">
        <div
          class="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0 cursor-pointer group shadow-md"
          @click="player.isModalOpen = true"
        >
          <img
            v-if="trackCover"
            :src="trackCover"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt="Track Cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
            <Icon name="solar:music-note-bold" class="w-6 h-6" />
          </div>
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Icon name="solar:maximize-square-linear" class="w-4 h-4 text-white" />
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <h4
              class="text-xs font-semibold text-zinc-100 truncate cursor-pointer hover:underline"
              @click="player.isModalOpen = true"
            >
              {{ trackTitle }}
            </h4>
            <!-- Equalizer Animation when playing -->
            <div v-if="player.isPlaying" class="flex items-end gap-0.5 h-3 flex-shrink-0" title="Memutar">
              <span class="w-[2px] bg-rose-500 rounded-full animate-wave-1"></span>
              <span class="w-[2px] bg-rose-500 rounded-full animate-wave-2"></span>
              <span class="w-[2px] bg-rose-500 rounded-full animate-wave-3"></span>
            </div>
          </div>
          <p class="text-[11px] text-zinc-400 truncate mt-0.5">
            {{ trackArtist }}
          </p>
        </div>

        <button
          @click="player.toggleLike(player.currentTrack)"
          class="p-2 text-zinc-400 hover:text-white transition-colors flex-shrink-0 active:scale-90"
          title="Sukai Lagu"
        >
          <Icon
            :name="player.isLiked(player.currentTrack) ? 'solar:heart-bold' : 'solar:heart-linear'"
            class="w-4 h-4"
            :class="player.isLiked(player.currentTrack) ? 'text-rose-500' : ''"
          />
        </button>
      </div>

      <!-- CENTER: Controls & Scrubber -->
      <div class="flex flex-col items-center justify-center flex-1 max-w-lg px-4">
        <!-- Control buttons -->
        <div class="flex items-center gap-5">
          <button
            @click="player.toggleShuffle()"
            class="relative transition-colors"
            :class="player.shuffle ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-200'"
            title="Acak Lagu"
          >
            <Icon name="solar:shuffle-linear" class="w-4 h-4" />
            <span v-if="player.shuffle" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500"></span>
          </button>

          <button
            @click="player.previous()"
            class="text-zinc-400 hover:text-white transition-colors active:scale-95"
            title="Lagu Sebelumnya"
          >
            <Icon name="solar:skip-previous-bold" class="w-4 h-4" />
          </button>

          <button
            @click="player.togglePlay()"
            class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
            :title="player.isPlaying ? 'Jeda' : 'Putar'"
          >
            <Icon
              :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'"
              class="w-4 h-4"
              :class="{ 'ml-0.5': !player.isPlaying }"
            />
          </button>

          <button
            @click="player.next()"
            class="text-zinc-400 hover:text-white transition-colors active:scale-95"
            title="Lagu Selanjutnya"
          >
            <Icon name="solar:skip-next-bold" class="w-4 h-4" />
          </button>

          <button
            @click="player.cycleRepeat()"
            class="relative transition-colors"
            :class="player.repeat !== 'off' ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-200'"
            title="Ulangi Lagu"
          >
            <Icon name="solar:repeat-linear" class="w-4 h-4" />
            <span v-if="player.repeat !== 'off'" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500"></span>
          </button>
        </div>

        <!-- Progress scrubber -->
        <div class="w-full flex items-center gap-3 mt-1.5">
          <span class="text-[10px] text-zinc-500 w-8 text-right font-mono">{{ formatTime(player.currentTime) }}</span>
          
          <div
            class="flex-1 h-1 hover:h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer relative transition-all"
            @click="handleSeek"
          >
            <div
              class="h-full bg-zinc-200 group-hover:bg-rose-500 relative transition-all duration-100 ease-linear"
              :style="{ width: `${progressPercentage}%` }"
            >
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow scale-125"></div>
            </div>
          </div>

          <span class="text-[10px] text-zinc-500 w-8 font-mono">{{ formatTime(player.duration) }}</span>
        </div>
      </div>

      <!-- RIGHT: Lyrics, Volume, Expand -->
      <div class="w-1/4 min-w-[200px] flex items-center justify-end gap-3.5">
        <!-- Lyrics Shortcut -->
        <button
          @click="player.isModalOpen = true"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
          :class="player.isModalOpen ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'"
          title="Tampilkan Lirik"
        >
          <Icon name="solar:notes-minimalistic-linear" class="w-4 h-4" />
          <span class="text-[11px] hidden lg:inline">Lirik</span>
        </button>

        <!-- Volume -->
        <div class="flex items-center gap-2">
          <button @click="player.toggleMute()" class="text-zinc-400 hover:text-white transition-colors">
            <Icon :name="player.muted ? 'solar:volume-cross-linear' : 'solar:volume-loud-linear'" class="w-4 h-4" />
          </button>
          <div class="w-16 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group" @click="handleVolumeClick">
            <div class="h-full bg-zinc-300 group-hover:bg-rose-500 transition-colors" :style="{ width: player.muted ? '0%' : `${player.volume * 100}%` }"></div>
          </div>
        </div>

        <!-- Expand Button -->
        <button
          @click="player.isModalOpen = true"
          class="text-zinc-400 hover:text-white transition-colors p-1"
          title="Buka Layar Penuh"
        >
          <Icon name="solar:maximize-square-linear" class="w-4 h-4" />
        </button>
      </div>

    </div>

  </div>
</template>
