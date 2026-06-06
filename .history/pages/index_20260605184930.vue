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

  <!-- Hero Banner -->
  <header class="mb-10 sm:mb-14 relative">
    <div class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-950 p-6 sm:p-12 border border-white/5 shadow-2xl group">
      <!-- Premium Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-black to-zinc-900/40"></div>
      <!-- Animated Glows -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-600/10 blur-[80px] pointer-events-none group-hover:bg-rose-600/20 transition-all duration-1000"></div>
      <div class="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-red-900/20 blur-[80px] pointer-events-none group-hover:bg-red-800/20 transition-all duration-1000"></div>

      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full mb-4 sm:mb-6 backdrop-blur-sm">
          <Icon name="solar:star-fall-bold-duotone" class="text-rose-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span class="text-rose-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Eksplorasi Tanpa Batas</span>
        </div>
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 leading-tight">
          Experience<br class="hidden sm:block"/>Music Differently
        </h2>
        <p class="text-sm sm:text-lg text-zinc-400 font-medium leading-relaxed max-w-lg mb-6 sm:mb-8">
          Temukan rilisan audio visual terbaik dan nikmati pengalaman streaming musik berestetika premium langsung dari YouTube.
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button class="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20 w-full sm:w-auto">
            <Icon name="solar:play-circle-bold" class="w-5 h-5" />
            Listen Now
          </button>
          <button class="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
            <Icon name="solar:music-library-2-bold-duotone" class="w-5 h-5" />
            Browse Genres
          </button>
        </div>
      </div>
      
      <!-- Hero Image/Graphic (Absolute Right) -->
      <div class="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon name="solar:headphones-round-sound-bold-duotone" class="w-64 h-64 text-rose-900/20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
      </div>
    </div>
  </header>

  <!-- Search Bar -->
  <div class="mb-10 sm:mb-12 sticky top-[60px] sm:top-[80px] z-40 bg-black/60 backdrop-blur-xl py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
    <div class="relative max-w-2xl mx-auto">
      <span class="absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-5 text-zinc-400 pointer-events-none">
        <Icon name="solar:minimalistic-magnifer-bold-duotone" class="w-5 h-5" />
      </span>
      <input
        v-model="search"
        type="text"
        placeholder="Cari judul lagu, genre, atau musisi..."
        class="w-full bg-zinc-900/60 border border-white/10 rounded-xl sm:rounded-2xl pl-12 sm:pl-14 pr-12 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 focus:bg-zinc-900 transition-all duration-300 shadow-inner"
      />
      <span v-if="search" @click="search = ''" class="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-5 text-zinc-500 hover:text-white cursor-pointer transition-colors">
        <Icon name="solar:close-circle-bold-duotone" class="w-5 h-5" />
      </span>
    </div>
  </div>

  <!-- Error State -->
  <div v-if="error" class="bg-red-950/30 border border-red-900/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-6 text-xs sm:text-sm text-red-300 flex items-center gap-3">
    <Icon name="solar:danger-triangle-bold-duotone" class="h-5 w-5 text-red-500 flex-shrink-0" />
    Gagal mengambil data lagu. Periksa sambungan atau setelan API Key Anda.
  </div>

  <!-- Section Header -->
  <div class="mb-6 sm:mb-8 flex items-end justify-between border-b border-white/5 pb-4 sm:pb-5">
    <div>
      <h3 class="text-xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2 sm:gap-3">
        <Icon :name="search ? 'solar:text-field-focus-bold-duotone' : 'solar:flame-bold-duotone'" class="text-rose-500 w-6 h-6 sm:w-7 sm:h-7" />
        {{ search ? 'Hasil Pencarian' : 'Trending Hits' }}
      </h3>
      <p class="text-zinc-500 text-xs sm:text-sm mt-1">Daftar putar kurasi terbaik untuk Anda</p>
    </div>
    <span class="hidden sm:flex items-center gap-1.5 text-sm text-zinc-400 font-medium px-4 py-2 bg-white/5 rounded-xl border border-white/10">
      <Icon name="solar:list-bold-duotone" class="w-4 h-4" />
      {{ tracks.length }} Tracks
    </span>
  </div>

  <!-- Track Grid -->
  <div class="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
    <div
      v-for="track in tracks"
      :key="track.id.videoId"
      @click="player.playTrack(track)"
      class="group relative bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-zinc-800/50 hover:border-rose-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <!-- Thumbnail -->
      <div class="relative aspect-[4/3] overflow-hidden bg-zinc-950 flex-shrink-0">
        <img
          :src="track.snippet?.thumbnails?.high?.url || track.snippet?.thumbnails?.medium?.url"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          alt="Cover"
          loading="lazy"
        >
        <!-- Premium Overlay & Play Button -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
          <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-rose-600/90 backdrop-blur-md text-white flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.6)]">
            <Icon name="solar:play-bold" class="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
          </div>
        </div>
        
        <!-- Duration Badge Placeholder -->
        <div class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
          <Icon name="solar:clock-circle-bold" class="w-3 h-3 inline-block mr-1 align-text-bottom" />
          HQ
        </div>
      </div>

      <!-- Track Info -->
      <div class="p-3.5 sm:p-5 flex-grow flex flex-col">
        <h4
          class="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-rose-400 transition-colors line-clamp-2 leading-tight mb-2"
          :title="track.snippet?.title"
        >
          {{ track.snippet?.title }}
        </h4>
        <div class="mt-auto flex items-center gap-2">
          <div class="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-white/10">
            <Icon name="solar:user-circle-bold" class="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
          </div>
          <p class="text-zinc-400 text-xs font-medium truncate">
            {{ track.snippet?.channelTitle }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-if="tracks.length === 0 && !loading" class="text-center py-16 sm:py-24 border border-dashed border-white/10 rounded-2xl sm:rounded-3xl mt-6 bg-white/5">
    <Icon name="solar:ghost-bold-duotone" class="w-12 h-12 sm:w-16 sm:h-16 text-zinc-600 mx-auto mb-3 sm:mb-4" />
    <p class="text-zinc-400 text-xs sm:text-sm">Tidak ada lagu yang cocok dengan pencarian Anda.</p>
  </div>

  <!-- Load More / Loading -->
  <div class="mt-8 sm:mt-12 flex flex-col items-center justify-center min-h-[60px]">
    <button
      v-if="nextPageToken && !loading"
      @click="fetchTracks(true)"
      class="bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 hover:border-rose-500/50 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
    >
      <Icon name="solar:refresh-circle-bold-duotone" class="w-5 h-5" />
      Load More Tracks
    </button>

    <div v-if="loading" class="flex items-center gap-2 sm:gap-2.5 text-rose-400 text-xs sm:text-sm font-medium tracking-wide bg-rose-600/5 border border-rose-600/10 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full animate-pulse">
      <Icon name="svg-spinners:bars-scale-fade" class="w-4 h-4" />
      Menyelaraskan frekuensi audio...
    </div>
  </div>

  <!-- Player Bar -->
  <transition name="slide-up">
    <div
      v-if="player.currentTrack"
      class="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[95%] sm:max-w-4xl bg-zinc-900/95 sm:bg-black/80 backdrop-blur-2xl border-t sm:border border-white/10 p-3 sm:p-4 sm:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-500 pb-[env(safe-area-inset-bottom,12px)] sm:pb-4"
    >
      <div class="flex items-center justify-between gap-3 sm:gap-4">

        <!-- Track Info -->
        <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div class="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 group">
            <img
              :src="player.currentTrack.snippet?.thumbnails?.default?.url"
              class="w-full h-full rounded-lg sm:rounded-xl object-cover border border-white/10 shadow-lg transition-all duration-700"
              :class="{'animate-[spin_10s_linear_infinite] rounded-full sm:rounded-full': player.isPlaying}"
              alt="Track Cover"
            >
            <!-- Center hole for record effect -->
            <div v-if="player.isPlaying" class="absolute inset-0 m-auto w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full border border-zinc-700"></div>
          </div>
          
          <div class="min-w-0">
            <h5 class="font-bold text-sm sm:text-lg text-white truncate pr-2 flex items-center gap-1.5 sm:gap-2">
              {{ player.currentTrack.snippet?.title }}
              <Icon v-if="player.isPlaying" name="svg-spinners:bars-scale" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 flex-shrink-0" />
            </h5>
            <p class="text-zinc-400 text-[11px] sm:text-sm truncate mt-0.5 font-medium flex items-center gap-1 sm:gap-1.5">
              <Icon name="solar:user-id-bold" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {{ player.currentTrack.snippet?.channelTitle }}
            </p>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
          <button class="hidden sm:flex w-10 h-10 items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Icon name="solar:skip-previous-bold" class="w-6 h-6" />
          </button>
          
          <button
            @click="player.togglePlay()"
            class="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all shadow-lg"
            :class="player.isPlaying
              ? 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
              : 'bg-rose-600 text-white hover:bg-rose-500 hover:scale-105 shadow-rose-600/30'
            "
          >
            <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-5 h-5 sm:w-7 sm:h-7" :class="{'ml-0.5 sm:ml-1': !player.isPlaying}" />
          </button>
          
          <button class="hidden sm:flex w-10 h-10 items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Icon name="solar:skip-next-bold" class="w-6 h-6" />
          </button>
          
          <div class="w-px h-8 bg-white/10 mx-2 hidden sm:block"></div>
          
          <button class="hidden sm:flex w-10 h-10 items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Icon name="solar:volume-loud-bold" class="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  </transition>

  <!-- Hidden YouTube Player -->
  <iframe
    v-if="player.currentTrack && player.isPlaying"
    :src="`https://www.youtube.com/embed/${player.currentTrack.id.videoId}?autoplay=1&enablejsapi=1`"
    allow="autoplay"
    class="fixed opacity-0 pointer-events-none w-0 h-0"
  />

  <!-- Bottom Spacer -->
  <div class="h-28 sm:h-36"></div>

</template>

<style scoped>
/* Animasi Player Muncul dari Bawah */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
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

/* Line Clamp */<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePlayerStore } from '~/stores/player'
import HeroBanner from '~/components/music/HeroBanner.vue'
import SearchBar from '~/components/music/SearchBar.vue'
import TrackGrid from '~/components/music/TrackGrid.vue'

const player = usePlayerStore()
const search = ref('')
const tracks = ref([])
const loading = ref(false)

const fetchTracks = async (isLoadMore = false) => {
  // logic fetch API kamu tetap di sini sebagai orchestrator data
}

// Watcher untuk search
let debounceTimeout = null
watch(search, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => { fetchTracks(false) }, 500)
})

onMounted(() => { fetchTracks() })
</script>

<template>
  <div class="min-h-screen bg-black text-white p-4">
    <HeroBanner />

    <SearchBar v-model="search" />

    <template v-if="search">
      <TrackGrid title="Hasil Pencarian" :tracks="tracks" />
    </template>
    
    <template v-else>
      <TrackGrid title="Trending Now" :tracks="tracks">
        <template #icon><Icon name="solar:flame-bold" class="text-rose-500" /></template>
      </TrackGrid>

      <TrackGrid title="New Releases" :tracks="tracks">
        <template #icon><Icon name="solar:music-note-bold" class="text-emerald-500" /></template>
      </TrackGrid>
    </template>

    <MusicPlayerBar v-if="player.currentTrack" />
  </div>
</template>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>