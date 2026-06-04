<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const search = ref('')
const tracks = ref([])
const nextPageToken = ref('')
const loading = ref(false)
const error = ref(false)

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
      tracks.value = [...tracks.value, ...(data.items || [])]
    } else {
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

let debounceTimeout = null
watch(search, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchTracks(false)
  }, 500)
})

onMounted(() => {
  fetchTracks()
})
</script>

<template>
  <header class="mb-8 sm:mb-12">
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 sm:p-10 border border-zinc-800/50 shadow-2xl">
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 max-w-2xl">
        <span class="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold mb-4 tracking-wide">
          Eksplorasi Tanpa Batas
        </span>
        <h2 class="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Discover New Music
        </h2>
        <p class="text-sm sm:text-base text-zinc-400 font-medium leading-relaxed">
          Temukan rilisan audio visual terbaik dan nikmati pengalaman streaming musik berestetika minimalis langsung dari platform YouTube.
        </p>
      </div>
    </div>
  </header>

  <div class="mb-8 sm:mb-10 sticky top-[73px] z-40 bg-zinc-950/40 backdrop-blur-md py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
    <div class="relative max-w-xl">
      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </span>
      <input
        v-model="search"
        type="text"
        placeholder="Cari judul lagu, genre, atau musisi..."
        class="w-full bg-zinc-900/90 border border-zinc-800/80 rounded-2xl pl-12 pr-5 py-3.5 sm:py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
      />
    </div>
  </div>

  <div v-if="error" class="bg-red-950/30 border border-red-900/40 p-4 rounded-2xl mb-6 text-sm text-red-300 flex items-center gap-3">
    <span class="h-2 w-2 rounded-full bg-red-500"></span>
    Gagal mengambil data lagu. Periksa sambungan atau setelan API Key Anda.
  </div>

  <div class="mb-6 flex items-baseline justify-between border-b border-zinc-800/40 pb-4">
    <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-white">
      {{ search ? 'Hasil Pencarian' : 'Trending Music Video' }}
    </h3>
    <span class="text-xs sm:text-sm text-zinc-400 font-medium px-3 py-1 bg-zinc-900 rounded-lg border border-zinc-800/40">
      {{ tracks.length }} Lagu Terbuka
    </span>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    <div
      v-for="track in tracks"
      :key="track.id.videoId"
      @click="player.playTrack(track)"
      class="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer hover:bg-zinc-900 hover:border-zinc-700/60 transition-all duration-300 flex flex-col justify-between"
    >
      <div class="relative aspect-video sm:h-48 overflow-hidden bg-zinc-950 flex-shrink-0">
        <img
          :src="track.snippet?.thumbnails?.high?.url || track.snippet?.thumbnails?.medium?.url"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt="Cover"
          loading="lazy"
        >
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div class="h-11 w-11 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shadow-xl shadow-emerald-500/20 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current ml-0.5" viewBox="0 0 20 20"><path d="M4.516 7.548c0-.443.24-.853.627-1.07l6.97-3.886c.374-.21.83-.21 1.204 0l6.97 3.886c.387.217.627.627.627 1.07v7.77c0 .442-.24.852-.627 1.07l-6.97 3.887c-.374.208-.83.208-1.204 0l-6.97-3.886c-.388-.218-.627-.628-.627-1.07v-7.77z" /></svg>
          </div>
        </div>
      </div>

      <div class="p-3.5 sm:p-5 flex-grow flex flex-col justify-between gap-1">
        <h4 class="font-semibold text-sm sm:text-base text-zinc-200 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug" :title="track.snippet?.title">
          {{ track.snippet?.title }}
        </h4>
        <p class="text-zinc-500 text-xs truncate mt-1">
          {{ track.snippet?.channelTitle }}
        </p>
      </div>
    </div>
  </div>

  <div v-if="tracks.length === 0 && !loading" class="text-center py-20 border border-dashed border-zinc-800 rounded-3xl mt-6">
    <p class="text-zinc-500 text-sm">Tidak ada lagu yang cocok dengan pencarian Anda.</p>
  </div>

  <div class="mt-12 flex flex-col items-center justify-center min-h-[60px]">
    <button
      v-if="nextPageToken && !loading"
      @click="fetchTracks(true)"
      class="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium text-sm px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
    >
      Load More Tracks
    </button>
    
    <div v-if="loading" class="flex items-center gap-2.5 text-emerald-400 text-sm font-medium tracking-wide bg-emerald-500/5 border border-emerald-500/10 px-5 py-2.5 rounded-full animate-pulse">
      <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
      Menyelaraskan frekuensi audio...
    </div>
  </div>

  <transition name="slide-up">
    <div
      v-if="player.currentTrack"
      class="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-3xl bg-zinc-900/90 border border-zinc-800/80 p-3.5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-xl z-50 transition-all duration-300"
    >
      <div class="flex items-center justify-between gap-4">
        
        <div class="flex items-center gap-3.5 min-w-0 flex-1">
          <img
            :src="player.currentTrack.snippet?.thumbnails?.default?.url"
            class="w-11 h-11 sm:w-14 sm:h-14 rounded-xl object-cover flex-shrink-0 border border-zinc-800/50 shadow-inner"
            alt="Track Cover"
          >
          <div class="min-w-0">
            <h5 class="font-bold text-sm sm:text-base text-white truncate pr-2">
              {{ player.currentTrack.snippet?.title }}
            </h5>
            <p class="text-zinc-400 text-xs truncate mt-0.5">
              {{ player.currentTrack.snippet?.channelTitle }}
            </p>
          </div>
        </div>

        <div class="flex items-center flex-shrink-0">
          <button
            @click="player.togglePlay()"
            class="h-11 px-5 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            :class="player.isPlaying 
              ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white' 
              : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/10'
            "
          >
            <component :is="player.isPlaying ? 'span' : 'span'">
              {{ player.isPlaying ? 'PAUSE' : 'PLAY' }}
            </component>
          </button>
        </div>

      </div>
    </div>
  </transition>

  <iframe
    v-if="player.currentTrack && player.isPlaying"
    :src="`https://www.youtube.com/embed/${player.currentTrack.id.videoId}?autoplay=1&enablejsapi=1`"
    allow="autoplay"
    class="fixed opacity-0 pointer-events-none w-0 h-0"
  />

  <div class="h-28 sm:h-36"></div>
</template>

<style scoped>
/* Transisi Animasi Smooth Saat Player Muncul */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100px) scale(0.95);
  opacity: 0;
}
@media (min-width: 768px) {
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translate(-50%, 100px) scale(0.95);
    opacity: 0;
  }
}

/* Modifikasi Line Clamp Murni CSS Utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>