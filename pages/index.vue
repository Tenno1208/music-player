<template>
  <div class="px-4 sm:px-8 py-6 space-y-10 max-w-7xl mx-auto">

    <!-- Hero Banner with Spotlight & Quick Actions -->
    <HomeHeroBanner @playFeatured="handlePlayFirstTrending" />

    <!-- Section 1: Artis Terpopuler -->
    <section class="space-y-4">
      <div v-if="loadingHome" class="space-y-4">
        <div class="h-6 w-40 bg-white/[0.05] rounded-lg animate-pulse"></div>
        <div class="flex gap-4 overflow-hidden">
          <div v-for="i in 5" :key="i" class="w-[160px] h-[210px] bg-white/[0.03] rounded-2xl animate-pulse flex-shrink-0"></div>
        </div>
      </div>

      <HomeCategoryRow
        v-else-if="popularArtists.length > 0"
        title="Artis Terpopuler"
        :items="popularArtists"
        :isArtist="true"
      />
    </section>

    <!-- Section 2: Album Pilihan -->
    <section class="space-y-4">
      <div v-if="loadingHome" class="space-y-4">
        <div class="h-6 w-40 bg-white/[0.05] rounded-lg animate-pulse"></div>
        <div class="flex gap-4 overflow-hidden">
          <div v-for="i in 5" :key="i" class="w-[160px] h-[210px] bg-white/[0.03] rounded-2xl animate-pulse flex-shrink-0"></div>
        </div>
      </div>

      <HomeCategoryRow
        v-else-if="popularAlbums.length > 0"
        title="Album Pilihan"
        :items="popularAlbums"
        :isArtist="false"
      />
    </section>

        <!-- Section 3: Tangga Lagu Teratas -->
    <section class="space-y-4 pt-2">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">
            Tangga Lagu Teratas
          </h2>
          <p class="text-xs text-zinc-500 font-medium mt-0.5">Lagu paling banyak diputar saat ini</p>
        </div>

        <button
          v-if="tracks.length > 0"
          @click="playAllTrending"
          class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white transition-all border border-white/[0.06] active:scale-95"
        >
          <Icon name="solar:play-bold" class="w-3.5 h-3.5 text-rose-400" />
          <span>Putar Semua</span>
        </button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loadingHome" class="space-y-2 py-4">
        <div v-for="i in 5" :key="i" class="h-14 bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse"></div>
      </div>

      <!-- Error state + retry -->
      <div v-else-if="error" class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center space-y-2">
        <p class="text-zinc-500 text-xs">Gagal memuat tangga lagu. Silakan coba beberapa saat lagi.</p>
        <button @click="refresh()" class="text-rose-400 hover:text-rose-300 text-xs font-bold">Coba Lagi</button>
      </div>

      <!-- Kosong -->
      <div v-else-if="tracks.length === 0" class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center text-zinc-500 text-xs">
        Belum ada lagu teratas saat ini.
      </div>

      <!-- Daftar lagu (self-contained, klik = putar via store) -->
      <div v-else class="space-y-1">
        <div
          v-for="(track, index) in tracks"
          :key="track.id"
          @click="playTrackRow(track)"
          class="group flex items-center gap-3 sm:gap-4 p-2 rounded-xl cursor-pointer transition-colors"
          :class="currentId === track.id ? 'bg-rose-500/[0.08]' : 'hover:bg-white/[0.05]'"
        >
          <span
            class="w-6 text-center text-sm font-semibold tabular-nums flex-shrink-0"
            :class="currentId === track.id ? 'text-rose-400' : 'text-zinc-500'"
          >
            {{ index + 1 }}
          </span>

          <img
            :src="track.albumCover"
            class="w-11 h-11 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] flex-shrink-0"
            loading="lazy"
          />

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold truncate" :class="currentId === track.id ? 'text-rose-400' : 'text-white'">
              {{ track.title }}
            </p>
            <p class="text-xs text-zinc-500 truncate">{{ track.artist }}</p>
          </div>

          <p class="hidden md:block text-xs text-zinc-500 truncate max-w-[180px]">{{ track.album }}</p>
          <span class="hidden sm:block text-xs text-zinc-500 tabular-nums">{{ fmtDuration(track.durationMs) }}</span>

          <button class="w-8 h-8 rounded-full bg-white text-black hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition flex-shrink-0">
            <Icon name="solar:play-bold" class="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

// Satu endpoint untuk semua konten beranda — data di-cache 1 jam di server,
// jadi request ini nyaris tanpa biaya & cepat (SSR-ready)
const { data: home, pending: loadingHome, error: homeError, refresh } = await useFetch('/api/home', {
  key: 'home-catalog'
})

const tracks = computed(() => home.value?.tracks || [])
const popularArtists = computed(() => home.value?.artists || [])
const popularAlbums = computed(() => home.value?.albums || [])
const error = computed(() => Boolean(homeError.value || home.value?.error))

const handlePlayFirstTrending = () => {
  if (tracks.value.length > 0) {
    player.setQueue(tracks.value)
    player.playTrack(tracks.value[0])
  }
}

const playAllTrending = () => {
  if (tracks.value.length > 0) {
    player.setQueue(tracks.value)
    player.playTrack(tracks.value[0])
  }
}

// id lagu yang sedang diputar (sesuaikan nama field dgn store kamu:
// misal player.currentTrack / player.nowPlaying)
const currentId = computed(() => player.currentTrack?.id ?? player.current?.id ?? null)

const playTrackRow = (track) => {
  player.setQueue(tracks.value) // seluruh tangga lagu masuk queue
  player.playTrack(track)       // mulai dari lagu yang diklik
}

const fmtDuration = (ms) => {
  const s = Math.round((ms || 0) / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
</script>