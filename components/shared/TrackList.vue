<template>
  <div class="select-none">
    <!-- Table Header (Desktop) -->
    <div class="hidden sm:grid grid-cols-12 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2 border-b border-white/[0.06] mb-2">
      <div class="col-span-1 text-center">#</div>
      <div class="col-span-6 sm:col-span-5 md:col-span-6">Judul</div>
      <div class="hidden sm:block sm:col-span-4 md:col-span-4">Channel / Album</div>
      <div class="col-span-2 sm:col-span-2 md:col-span-1 text-right">Durasi</div>
    </div>

    <!-- Track Rows -->
    <div class="space-y-1">
      <div
        v-for="(track, index) in tracks"
        :key="track.id?.videoId || index"
        @click="playSong(track)"
        class="grid grid-cols-12 items-center px-3 sm:px-4 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group border border-transparent hover:border-white/[0.04]"
        :class="{ 'bg-white/[0.06] border-white/[0.08]': isCurrentTrack(track) }"
      >
        <!-- Col 1: Index / Play Icon / Equalizer -->
        <div class="col-span-2 sm:col-span-1 flex items-center justify-center text-center">
          <!-- Active Equalizer Animation when playing this track -->
          <div v-if="isCurrentTrack(track) && player.isPlaying" class="flex items-end gap-0.5 h-3">
            <span class="w-[2px] bg-rose-500 rounded-full animate-wave-1"></span>
            <span class="w-[2px] bg-rose-500 rounded-full animate-wave-2"></span>
            <span class="w-[2px] bg-rose-500 rounded-full animate-wave-3"></span>
          </div>
          <!-- Otherwise show index or play icon on hover -->
          <div v-else class="flex items-center justify-center">
            <span
              class="text-xs font-mono text-zinc-500 group-hover:hidden"
              :class="{ 'text-rose-400 font-bold': isCurrentTrack(track) }"
            >
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <Icon
              name="solar:play-bold"
              class="w-3.5 h-3.5 text-white hidden group-hover:block transition-transform group-hover:scale-110"
            />
          </div>
        </div>

        <!-- Col 2: Thumbnail & Title -->
        <div class="col-span-8 sm:col-span-5 md:col-span-6 flex items-center gap-3 min-w-0 pr-2">
          <div class="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10 shadow-sm">
            <img
              :src="track.snippet?.thumbnails?.default?.url || track.snippet?.thumbnails?.medium?.url"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              alt="Track Art"
              loading="lazy"
            />
          </div>
          <div class="min-w-0 flex flex-col justify-center">
            <span
              class="text-xs sm:text-sm font-semibold truncate transition-colors"
              :class="isCurrentTrack(track) ? 'text-rose-400' : 'text-zinc-200 group-hover:text-white'"
            >
              {{ track.snippet?.title }}
            </span>
            <span class="text-[11px] text-zinc-500 truncate mt-0.5 hover:text-zinc-300 font-medium">
              {{ track.snippet?.channelTitle }}
            </span>
          </div>
        </div>

        <!-- Col 3: Channel / Meta (Desktop) -->
        <div class="hidden sm:block sm:col-span-4 md:col-span-4 text-xs text-zinc-400 truncate pr-4 font-normal">
          {{ track.snippet?.channelTitle }}
        </div>

        <!-- Col 4: Like & Duration -->
        <div class="col-span-2 sm:col-span-2 md:col-span-1 flex items-center justify-end gap-3 text-zinc-500">
          <button
            @click.stop="player.toggleLike(track)"
            class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-white"
            title="Sukai"
          >
            <Icon
              :name="player.isLiked(track) ? 'solar:heart-bold' : 'solar:heart-linear'"
              class="w-3.5 h-3.5"
              :class="player.isLiked(track) ? 'text-rose-500 opacity-100' : ''"
            />
          </button>
          <span class="text-xs font-mono text-zinc-500">
            {{ isCurrentTrack(track) && player.duration ? formatTime(player.duration) : '3:45' }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '~/stores/player'

const props = defineProps({
  tracks: {
    type: Array,
    required: true
  }
})

const player = usePlayerStore()

const isCurrentTrack = (track) => {
  return player.currentTrack?.id?.videoId === track.id?.videoId
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '3:45'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const playSong = (track) => {
  player.setQueue(props.tracks)
  player.playTrack(track)
}
</script>
