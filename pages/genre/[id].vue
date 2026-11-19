<template>
  <div class="space-y-8 pb-10">
    <!-- Skeleton loading -->
    <div v-if="pending" class="space-y-6">
      <div class="h-56 sm:h-72 rounded-3xl bg-white/[0.04] animate-pulse" />
      <div v-for="i in 8" :key="i" class="h-12 rounded-xl bg-white/[0.03] animate-pulse" />
    </div>

    <template v-else-if="genre && !genre.error">
      <!-- Hero genre -->
      <div class="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] min-h-[240px] sm:min-h-[300px]">
        <img v-if="genre.image" :src="genre.image" class="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" />
        <div v-else class="absolute inset-0" :style="{ background: 'linear-gradient(135deg, #f43f5e, #1e1b4b)' }" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/60 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-r from-[#0d0d11]/70 to-transparent" />

        <div class="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 space-y-3">
          <span class="text-[10px] uppercase tracking-widest font-bold text-rose-400">Genre</span>
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">{{ genre.name }}</h1>
          <div class="flex items-center gap-4 text-xs text-zinc-300 font-medium">
            <span>{{ genre.tracks.length }} lagu teratas</span>
            <span v-if="genre.artists.length">{{ genre.artists.length }} artis populer</span>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button
              @click="playAll"
              class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg"
            >
              <Icon :name="isPlayingAll ? 'solar:pause-bold' : 'solar:play-bold'" class="w-4 h-4 ml-0.5" />
              {{ isPlayingAll ? 'Jeda' : 'Putar Semua' }}
            </button>
            <button
              @click="playShuffle"
              class="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white font-medium text-xs tracking-wide transition-colors"
            >
              Acak
            </button>
          </div>
        </div>
      </div>

      <!-- Lagu teratas -->
      <section>
        <h2 class="text-lg font-bold text-white mb-3">Lagu Teratas</h2>
        <div
          v-for="(track, index) in genre.tracks"
          :key="track.id"
          @click="togglePlay(track)"
          class="group flex items-center gap-3 sm:gap-4 p-2 rounded-xl cursor-pointer transition-colors"
          :class="playingId === track.id ? 'bg-rose-500/[0.08]' : 'hover:bg-white/[0.05]'"
        >
          <span class="w-6 text-center text-sm font-semibold tabular-nums flex-shrink-0" :class="playingId === track.id ? 'text-rose-400' : 'text-zinc-500'">
            <span v-if="playingId === track.id" class="eq"><i /><i /><i /></span>
            <template v-else>{{ index + 1 }}</template>
          </span>

          <img :src="track.albumCover" class="w-11 h-11 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] flex-shrink-0" loading="lazy" />

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold truncate" :class="playingId === track.id ? 'text-rose-400' : 'text-white'">{{ track.title }}</p>
            <p class="text-xs text-zinc-500 truncate">{{ track.artist }}</p>
          </div>

          <p class="hidden md:block text-xs text-zinc-500 truncate max-w-[180px]">{{ track.album }}</p>
          <span class="hidden sm:block text-xs text-zinc-500 tabular-nums">{{ fmtDuration(track.durationMs) }}</span>

          <button class="w-8 h-8 rounded-full bg-white text-black hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition flex-shrink-0">
            <Icon :name="playingId === track.id ? 'solar:pause-bold' : 'solar:play-bold'" class="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </section>

      <!-- Artis populer (pakai komponen MediaSection yang sudah ada) -->
      <MediaSection
        v-if="genre.artists.length"
        :title="`Artis ${genre.name}`"
        subtitle="Paling banyak didengar di genre ini"
        :items="artistItems"
        is-artist
      />
    </template>

    <!-- Error -->
    <div v-else class="text-center py-20 space-y-3">
      <Icon name="solar:sad-circle-bold" class="w-12 h-12 text-zinc-600 mx-auto" />
      <p class="text-zinc-400 font-medium">Genre tidak ditemukan atau gagal dimuat.</p>
      <button @click="navigateTo('/')" class="text-rose-400 hover:text-rose-300 text-sm font-semibold">Kembali ke Beranda</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { usePlayerStore } from '~/stores/player'

const route = useRoute()
const player = usePlayerStore()

const genreUrl = computed(() => {
  const base = `/api/genre/${route.params.id}`
  return route.query.name ? `${base}?name=${encodeURIComponent(route.query.name)}` : base
})

const { data: genre, pending } = await useFetch(genreUrl, { key: 'genre-detail' })

const tracks = computed(() => genre.value?.tracks || [])
const artistItems = computed(() =>
  (genre.value?.artists || []).map((a) => ({
    id: a.id,
    name: a.name,
    image: a.image,
    description: `${fmtNumber(a.fans)} fans • ${a.albums} album`
  }))
)

// ===== pemutar preview lokal (30 detik) =====
let audio = null
const playingId = ref(null)
const isPlayingAll = ref(false)

const stopAudio = () => {
  if (audio) { audio.pause(); audio = null }
  playingId.value = null
  isPlayingAll.value = false
}

const togglePlay = (track) => {
  if (playingId.value === track.id) return stopAudio()
  if (!track.previewUrl) return
  stopAudio()
  audio = new Audio(track.previewUrl)
  audio.play()
  playingId.value = track.id
  audio.onended = () => { if (!isPlayingAll.value) playingId.value = null }
}

const startAt = (index) => {
  const list = tracks.value
  const t = list[index]
  if (!t?.previewUrl) return
  stopAudio()
  isPlayingAll.value = true
  audio = new Audio(t.previewUrl)
  playingId.value = t.id
  audio.play()
  audio.onended = () => {
    if (isPlayingAll.value && index + 1 < list.length) startAt(index + 1)
    else stopAudio()
  }
}

const playAll = () => {
  if (!tracks.value.length) return
  player.setQueue(tracks.value)      // masukkan semua lagu genre ke queue
  player.playTrack(tracks.value[0])  // mulai dari lagu pertama
}

const playShuffle = () => {
  const list = tracks.value
  if (!list.length) return
  startAt(Math.floor(Math.random() * list.length))
}

// ===== helper =====
const fmtDuration = (ms) => {
  const s = Math.round((ms || 0) / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
const fmtNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + ' JT'
  if (n >= 1e3) return Math.round(n / 1e3) + ' RB'
  return String(n || 0)
}

onBeforeUnmount(stopAudio)
</script>

<style scoped>
.eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
.eq i { display: block; width: 3px; border-radius: 1px; background: currentColor; animation: eq .8s ease-in-out infinite; }
.eq i:nth-child(1) { height: 60%; animation-delay: 0s; }
.eq i:nth-child(2) { height: 100%; animation-delay: .2s; }
.eq i:nth-child(3) { height: 40%; animation-delay: .4s; }
@keyframes eq { 0%, 100% { transform: scaleY(.4); } 50% { transform: scaleY(1); } }
</style>