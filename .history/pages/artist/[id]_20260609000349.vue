<template>
  <div class="min-h-screen bg-[#121212] text-white p-6 md:p-10 flex flex-col pb-24">
    <button @click="$router.back()" class="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors self-start">
      <Icon name="solar:alt-arrow-left-bold" class="w-6 h-6" />
      <span class="font-bold">Kembali</span>
    </button>

    <div v-if="pending" class="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-400">
      <Icon name="solar:refresh-bold" class="animate-spin w-8 h-8 text-rose-500" />
      <p class="text-sm font-medium">Memuat data asli dari Spotify...</p>
    </div>

    <div v-else-if="error || !artistInfo" class="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
      <Icon name="solar:danger-circle-bold" class="w-12 h-12 text-zinc-600" />
      <h3 class="text-lg font-bold text-zinc-300">Gagal Memuat Profil</h3>
      <p class="text-xs text-zinc-500 max-w-xs">Data profil orisinal tidak ditemukan atau API Spotify lokal Anda mengalami gangguan.</p>
    </div>

    <template v-else>
      <div class="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 text-center md:text-left">
        <div class="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/5 flex-shrink-0 bg-zinc-900">
          <img v-if="artistInfo.image" :src="artistInfo.image" class="w-full h-full object-cover" :alt="artistInfo.name" />
          <div v-else class="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
            <Icon name="solar:user-bold" class="w-12 h-12" />
          </div>
        </div>
        <div class="flex flex-col justify-center mt-4 min-w-0">
          <h1 class="text-4xl md:text-5xl font-black mb-2 tracking-tight truncate">{{ artistInfo.name }}</h1>
          <p class="text-rose-400 font-bold text-sm flex items-center justify-center md:justify-start gap-1">
            <Icon name="solar:verified-check-bold" class="w-4 h-4" />
            <span>Artis Terverifikasi Spotify (Popularitas: #{{ artistInfo.popularity }})</span>
          </p>
          <div class="mt-6 flex gap-3 justify-center md:justify-start">
            <div class="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">

  <button
    @click="playAllTracks"
    class="bg-rose-500 hover:bg-rose-600 px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95"
  >
    ▶ Putar Semua
  </button>

  <button
    @click="addAllToQueue"
    class="bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95"
  >
    ➕ Tambah Antrian
  </button>

  <button
    @click="shuffleAllTracks"
    class="bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95"
  >
    🔀 Acak
  </button>

</div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-black tracking-tight border-b border-white/5 pb-2 text-zinc-300">Lagu Terpopuler</h2>
        
        <div v-if="!artistInfo.topTracks || artistInfo.topTracks.length === 0" class="p-8 rounded-2xl bg-white/5 text-center text-zinc-500 text-xs">
          <Icon name="solar:music-notes-linear" class="w-6 h-6 mx-auto mb-2 text-zinc-600" />
          Tidak ada daftar lagu populer yang dikembalikan dari API Spotify Anda.
        </div>

        <div v-else class="space-y-2">
          <div 
            v-for="(track, index) in artistInfo.topTracks" 
            :key="index"
            @click="handlePlayTrack(track, index)"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
          >
            <span class="text-zinc-500 font-bold w-6 text-center group-hover:text-rose-400 transition-colors">{{ index + 1 }}</span>
            <img :src="track.albumCover" class="w-12 h-12 rounded-lg object-cover bg-zinc-800 border border-white/5" alt="Album" />
            <div class="flex-1 min-w-0">
              <p class="font-bold text-white truncate group-hover:text-rose-400 transition-colors">{{ track.title }}</p>
              <p class="text-zinc-400 text-xs truncate mt-0.5">{{ artistInfo.name }}</p>
            </div>
            
            <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-transparent group-hover:bg-rose-500 text-zinc-400 group-hover:text-white">
              <Icon v-if="loadingTrackIndex === index" name="solar:refresh-bold" class="w-4 h-4 animate-spin" />
              <Icon v-else name="solar:play-bold" class="w-4 h-4" />
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

// Indikator loading per item lagu
const loadingTrackIndex = ref(null)

// 🌐 AMBIL DATA PROFIL DARI API SPOTIFY LOKAL
const { data: artistInfo, pending, error } = await useAsyncData(
  `artist-${artistId}`,
  async () => {
    try {
      const res = await $fetch('/api/spotify', {
        query: {
          q: artistName
        }
      })

      if (!res) return null

      return {
        name: res.name,
        image: res.image,
        popularity: res.popularity || '0',
        topTracks: res.topTracks || []
      }
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memproses data API Spotify')
    }
  }
)

// 🚀 FUNGSI AUTOMATIC SEARCH VIDEO ID YOUTUBE SEBELUM MEMUTAR MUSIK
const handlePlayTrack = async (spotifyTrack, index) => {
  if (!spotifyTrack || !player.playTrack || loadingTrackIndex.value !== null) return

  loadingTrackIndex.value = index

  try {
    // 1. Tembak pencarian ke backend YouTube Anda menggunakan data nama artis + judul lagu asli Spotify
    const searchQuery = `${artistInfo.value?.name} ${spotifyTrack.title}`
    const searchData = await $fetch('/api/tracks', {
      query: { q: searchQuery }
    })

    // 2. Ambil item pertama dari hasil pencarian database YouTube Anda
    const targetYoutubeTrack = searchData.items?.[0]

    if (targetYoutubeTrack && targetYoutubeTrack.id?.videoId) {
      // 3. Jika videoId asli dari YouTube ditemukan, kirim datanya langsung ke Pinia Store
      player.playTrack(targetYoutubeTrack)
    } else {
      // Strategi Cadangan: Jika endpoint pencarian terisolasi gagal, buat struktur bungkusan paksa
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
    console.error('Pencarian Otomatis Video Stream YouTube Gagal:', err)
  } finally {
    loadingTrackIndex.value = null
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>