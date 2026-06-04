<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const search = ref('')
const tracks = ref([])
const nextPageToken = ref('')
const loading = ref(false)
const error = ref(false)

// Fungsi utama untuk ambil data dari API kita
const fetchTracks = async (isLoadMore = false) => {
  if (loading.value) return
  loading.value = true
  error.value = false

  try {
    const data = await $fetch('/api/tracks', {
      query: {
        q: search.value,
        pageToken: isLoadMore ? nextPageToken.value : ''
      }
    })

    if (isLoadMore) {
      // Jika load more, gabungkan data baru ke data lama
      tracks.value = [...tracks.value, ...(data.items || [])]
    } else {
      // Jika search baru atau load awal, ganti datanya
      tracks.value = data.items || []
    }

    nextPageToken.value = data.nextPageToken || ''
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Menggunakan debounce untuk search agar tidak nembak API setiap ketikan huruf
let debounceTimeout = null
watch(search, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchTracks(false) // Reset data dan cari dari awal
  }, 500) // Tunggu 500ms setelah user selesai mengetik
})

// Load data pertama kali saat komponen dimount
onMounted(() => {
  fetchTracks()
})
</script>

<template>
  <header class="mb-10">
    <div class="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-10">
      <h1 class="text-5xl font-black mb-4">Discover New Music</h1>
      <p class="text-white/80">Streaming music modern dengan YouTube API</p>
    </div>
  </header>

  <div class="mb-8">
    <input
      v-model="search"
      type="text"
      placeholder="Cari lagu atau artis..."
      class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
    />
  </div>

  <div v-if="error" class="bg-red-900/40 p-4 rounded-xl mb-6 text-red-200">
    Gagal mengambil data lagu. Coba periksa koneksi atau API Key Anda.
  </div>

  <div class="mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold">
      {{ search ? 'Hasil Pencarian' : 'Trending Tracks' }}
    </h2>
    <span class="text-zinc-400">
      {{ tracks.length }} Lagu Terbuka
    </span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="track in tracks"
      :key="track.id.videoId"
      @click="player.playTrack(track)"
      class="bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 border border-zinc-800/50"
    >
      <img
        :src="track.snippet?.thumbnails?.high?.url"
        class="w-full h-56 object-cover"
        alt="Thumbnail"
      >
      <div class="p-4">
        <h3 class="font-bold truncate" :title="track.snippet?.title">
          {{ track.snippet?.title }}
        </h3>
        <p class="text-zinc-400 text-sm truncate">
          {{ track.snippet?.channelTitle }}
        </p>
      </div>
    </div>
  </div>

  <div v-if="tracks.length === 0 && !loading" class="text-center py-12 text-zinc-500">
    Lagu tidak ditemukan.
  </div>

  <div class="mt-12 flex justify-center">
    <button
      v-if="nextPageToken && !loading"
      @click="fetchTracks(true)"
      class="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-8 py-3 rounded-2xl transition-all"
    >
      Load More
    </button>
    <div v-if="loading" class="text-emerald-500 font-medium animate-pulse">
      Menyelaraskan nada... (Loading)
    </div>
  </div>

  <div
    v-if="player.currentTrack"
    class="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-zinc-800 p-4 z-50"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-4 max-w-[70%]">
        <img
          :src="player.currentTrack.snippet?.thumbnails?.default?.url"
          class="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        >
        <div class="truncate">
          <h3 class="font-bold truncate">
            {{ player.currentTrack.snippet?.title }}
          </h3>
          <p class="text-zinc-400 text-sm truncate">
            {{ player.currentTrack.snippet?.channelTitle }}
          </p>
        </div>
      </div>

      <button
        @click="player.togglePlay()"
        class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black px-8 py-3 rounded-full font-bold transition-all flex-shrink-0"
      >
        {{ player.isPlaying ? 'Pause' : 'Play' }}
      </button>
    </div>
  </div>

  <iframe
    v-if="player.currentTrack && player.isPlaying"
    :src="`https://www.youtube.com/embed/${player.currentTrack.id.videoId}?autoplay=1&enablejsapi=1`"
    allow="autoplay"
    class="fixed opacity-0 pointer-events-none w-0 h-0"
  />

  <div class="h-32"></div>
</template>