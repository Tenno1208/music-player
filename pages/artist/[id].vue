<template>
  <div class="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-8 select-none">
    
    <!-- Back Navigation Link -->
    <button
      @click="$router.back()"
      class="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
    >
      <Icon name="solar:alt-arrow-left-linear" class="w-4 h-4" />
      <span>Kembali</span>
    </button>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-24 gap-3 text-zinc-400">
      <Icon name="solar:refresh-linear" class="animate-spin w-8 h-8 text-rose-500" />
      <p class="text-xs font-medium">Memuat profil artis dari Spotify...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !artistInfo" class="flex flex-col items-center justify-center text-center py-20 space-y-3 bg-white/[0.01] rounded-3xl border border-white/[0.05] p-8">
      <Icon name="solar:danger-circle-linear" class="w-10 h-10 text-zinc-600" />
      <h3 class="text-base font-bold text-white">Profil Artis Tidak Ditemukan</h3>
      <p class="text-xs text-zinc-500 max-w-xs">Data profil artis tidak dapat dimuat saat ini. Silakan periksa kembali nanti.</p>
    </div>

    <!-- Artist Content -->
    <template v-else>
      <!-- Artist Hero Banner -->
      <div class="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 to-[#121216] border border-white/[0.08] p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 shadow-2xl">
        
        <!-- Artist Avatar -->
        <div class="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl border-2 border-white/10 flex-shrink-0 bg-zinc-800">
          <img
            v-if="artistInfo.image"
            :src="artistInfo.image"
            class="w-full h-full object-cover"
            :alt="artistInfo.name"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
            <Icon name="solar:user-bold" class="w-12 h-12" />
          </div>
        </div>

        <!-- Artist Info & Controls -->
        <div class="flex-1 text-center md:text-left space-y-3 min-w-0">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Icon name="solar:verified-check-bold" class="w-4 h-4" />
            <span>Artis Terverifikasi</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight truncate">
            {{ artistInfo.name }}
          </h1>

          <p class="text-xs text-zinc-400 font-medium">
            Skor Popularitas Spotify: <span class="text-white font-semibold">#{{ artistInfo.popularity }}</span>
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              @click="playAllTracks"
              class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg"
            >
              <Icon name="solar:play-bold" class="w-4 h-4 ml-0.5" />
              <span>Putar</span>
            </button>

            <button
              @click="shuffleAllTracks"
              class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white font-semibold text-xs tracking-wider transition-all active:scale-95"
            >
              <Icon name="solar:shuffle-linear" class="w-4 h-4" />
              <span>Acak</span>
            </button>

            <button
              @click="addAllToQueue"
              class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white font-semibold text-xs tracking-wider transition-all active:scale-95"
            >
              <Icon name="solar:playlist-minimalistic-linear" class="w-4 h-4" />
              <span>Tambah Antrean</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Top Tracks Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">
            Karya Terpopuler
          </h2>
          <span class="text-xs text-zinc-500 font-medium">Sinkronisasi Spotify</span>
        </div>

        <div v-if="!artistInfo.topTracks || artistInfo.topTracks.length === 0" class="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center text-zinc-500 text-xs">
          Tidak ada daftar lagu yang ditemukan.
        </div>

        <div v-else class="space-y-1">
          <div
            v-for="(track, index) in artistInfo.topTracks"
            :key="index"
            @click="handlePlayTrack(track, index)"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group border border-transparent hover:border-white/[0.04]"
          >
            <span class="text-xs font-mono text-zinc-500 w-6 text-center group-hover:text-rose-400 font-semibold">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <img
              :src="track.albumCover"
              class="w-11 h-11 rounded-lg object-cover bg-zinc-800 border border-white/10 flex-shrink-0"
              alt="Album"
              loading="lazy"
            />

            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-semibold text-zinc-100 truncate group-hover:text-rose-400 transition-colors">
                {{ track.title }}
              </p>
              <p class="text-[11px] text-zinc-500 truncate mt-0.5 font-medium">
                {{ artistInfo.name }}
              </p>
            </div>

            <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all text-zinc-400 group-hover:text-white">
              <Icon v-if="loadingTrackIndex === index" name="solar:refresh-linear" class="w-4 h-4 animate-spin text-rose-500" />
              <Icon v-else name="solar:play-bold" class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '~/stores/player'

const route = useRoute()
const player = usePlayerStore()

const artistId = route.params.id
const artistName = route.query.name

const loadingTrackIndex = ref(null)

const { data: artistInfo, pending, error } = await useAsyncData(
  `artist-${artistId}`,
  async () => {
    try {
      const res = await $fetch('/api/spotify', {
        query: { q: artistName }
      })

      if (!res || res.error) return null

      return {
        name: res.name,
        image: res.image,
        popularity: res.popularity || '0',
        topTracks: res.topTracks || []
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }
)

const handlePlayTrack = async (spotifyTrack, index) => {
  if (!spotifyTrack || loadingTrackIndex.value !== null) return

  loadingTrackIndex.value = index

  try {
    const searchQuery = `${artistInfo.value?.name} ${spotifyTrack.title}`
    const searchData = await $fetch('/api/tracks', {
      query: { q: searchQuery }
    })

    const targetYoutubeTrack = searchData.items?.[0]

    if (targetYoutubeTrack && targetYoutubeTrack.id?.videoId) {
      player.playTrack(targetYoutubeTrack)
    } else {
      const fallbackTrack = {
        id: { videoId: spotifyTrack.videoId || '' },
        snippet: {
          title: spotifyTrack.title,
          channelTitle: artistInfo.value?.name || 'Unknown Artist',
          thumbnails: {
            medium: { url: spotifyTrack.albumCover || artistInfo.value?.image },
            high: { url: spotifyTrack.albumCover || artistInfo.value?.image }
          }
        }
      }
      player.playTrack(fallbackTrack)
    }
  } catch (err) {
    console.error('Track play error:', err)
  } finally {
    loadingTrackIndex.value = null
  }
}

const convertSpotifyTracksToYoutube = async () => {
  const results = []
  if (!artistInfo.value?.topTracks) return results

  for (const track of artistInfo.value.topTracks.slice(0, 8)) {
    try {
      const searchQuery = `${artistInfo.value.name} ${track.title}`
      const searchData = await $fetch('/api/tracks', {
        query: { q: searchQuery }
      })
      const ytTrack = searchData.items?.[0]
      if (ytTrack) results.push(ytTrack)
    } catch (err) {
      console.error(err)
    }
  }

  return results
}

const addAllToQueue = async () => {
  const tracks = await convertSpotifyTracksToYoutube()
  if (!tracks.length) return
  tracks.forEach(track => player.addToQueue(track))
}

const playAllTracks = async () => {
  const tracks = await convertSpotifyTracksToYoutube()
  if (!tracks.length) return
  player.setQueue(tracks)
  player.playTrack(tracks[0])
}

const shuffleAllTracks = async () => {
  const tracks = await convertSpotifyTracksToYoutube()
  if (!tracks.length) return
  const shuffled = [...tracks].sort(() => Math.random() - 0.5)
  player.setQueue(shuffled)
  player.playTrack(shuffled[0])
}
</script>
