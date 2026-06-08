<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSearchStore } from '~/stores/search'
import { usePlayerStore } from '~/stores/player'

const searchStore = useSearchStore()
const playerStore = usePlayerStore()

const tracks = ref([])
const nextPageToken = ref('')
const loading = ref(false)
const error = ref(false)

// Data Statis Rekomendasi Kategori Genre (Mirip Spotify Premium Keren)
const recommendedGenres = ref([
  { name: 'Pop Indonesia', color: 'from-pink-600 to-rose-700', icon: 'solar:music-note-bold' },
  { name: 'Indie & Folk', color: 'from-amber-600 to-yellow-700', icon: 'solar: आख़िर-bold' || 'solar:leaf-bold' },
  { name: 'Chill & Relax', color: 'from-teal-600 to-cyan-700', icon: 'solar:cloud-sun-bold' },
  { name: 'Hip Hop / R&B', color: 'from-purple-600 to-indigo-700', icon: 'solar:boombox-bold' }
])

// Data Rekomendasi Lagu Trending saat kolom pencarian kosong
const trendingTracks = ref([
  {
    id: { videoId: '51kyrUsAVqUBcoDEMFkX12' },
    snippet: {
      title: 'Secukupnya',
      channelTitle: 'Hindia',
      thumbnails: {
        medium: { url: 'https://i.scdn.co/image/ab67616100005174b786cb6de7505caff17fe11f' },
        high: { url: 'https://i.scdn.co/image/ab6761610000e5ebb786cb6de7505caff17fe11f' }
      }
    }
  },
  {
    id: { videoId: '3wOsYKZM0zcKNasi3I7fP4' },
    snippet: {
      title: 'Sial',
      channelTitle: 'Mahalini',
      thumbnails: {
        medium: { url: 'https://i.scdn.co/image/ab67616100005174d3564043a332daaa882853d6' },
        high: { url: 'https://i.scdn.co/image/ab6761610000e5ebd3564043a332daaa882853d6' }
      }
    }
  },
  {
    id: { videoId: '7pbDxGE6nQSZVfiFdq9lOL' },
    snippet: {
      title: 'Pluto Projector',
      channelTitle: 'Rex Orange County',
      thumbnails: {
        medium: { url: 'https://i.scdn.co/image/ab67616100005174901ccc452604c427ef5f202f' },
        high: { url: 'https://i.scdn.co/image/ab6761610000e5eb901ccc452604c427ef5f202f' }
      }
    }
  }
])

const fetchTracks = async (isLoadMore = false) => {
  if (!searchStore.search.trim()) {
    if (!isLoadMore) tracks.value = []
    return
  }
  
  if (loading.value) return
  loading.value = true
  error.value = false

  try {
    const data = await $fetch('/api/tracks', {
      query: {
        q: searchStore.search,
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

// Fungsi shortcut pas user klik salah satu kotak genre rekomendasi
const selectGenre = (genreName) => {
  searchStore.search = genreName
}

// Fungsi putar lagu rekomendasi instan langsung ke player global
const playTrackInstantly = (track) => {
  if (playerStore.playTrack) {
    playerStore.playTrack(track)
  }
}

let debounceTimeout = null
watch(() => searchStore.search, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchTracks(false)
  }, 500)
})

onMounted(() => {
  if (searchStore.search) {
    fetchTracks(false)
  }
})
</script>

<template>
  <!-- Menambahkan pb-24 agar konten bawah tidak pernah menabrak Navbar Mobile -->
  <div class="px-4 sm:px-6 py-6 pb-24 max-w-5xl mx-auto selection:bg-rose-600 selection:text-white">
    
    <!-- ================== DEFAULT STATE: HALAMAN AWAL PENCARIAN (KOSONG) ================== -->
    <div v-if="!searchStore.search.trim()" class="space-y-10 mt-2">
      
      <!-- Bagian 1: Kotak Grid Jelajahi Kategori Genre Musik -->
      <div class="space-y-4">
        <h3 class="text-lg font-black tracking-tight text-white flex items-center gap-2">
          <Icon name="solar:compass-big-bold-duotone" class="text-rose-500 w-5 h-5" />
          <span>Jelajahi Kategori</span>
        </h3>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div 
            v-for="(genre, index) in recommendedGenres" 
            :key="index"
            @click="selectGenre(genre.name)"
            :class="`bg-gradient-to-br ${genre.color} aspect-[16/10] rounded-2xl p-4 relative overflow-hidden group cursor-pointer border border-white/5 shadow-lg active:scale-95 transition-all duration-300`"
          >
            <!-- Background Icon Efek Bayangan Besar -->
            <Icon :name="genre.icon" class="absolute -right-4 -bottom-4 w-20 h-20 text-black/10 transform rotate-12 group-hover:scale-110 transition-transform" />
            
            <span class="text-sm font-black text-white block drop-shadow-md tracking-tight">
              {{ genre.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bagian 2: Rekomendasi Lagu Populer/Trending Instan -->
      <div class="space-y-4">
        <h3 class="text-lg font-black tracking-tight text-white flex items-center gap-2">
          <Icon name="solar:fire-bold-duotone" class="text-rose-500 w-5 h-5" />
          <span>Sedang Tren Sekarang</span>
        </h3>

        <div class="space-y-2.5">
          <div 
            v-for="(trackItem, idx) in trendingTracks" 
            :key="idx"
            @click="playTrackInstantly(trackItem)"
            class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 active:bg-white/10 transition-all duration-200 group cursor-pointer"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-bold text-zinc-500 w-4 text-center group-hover:text-rose-400">
                {{ idx + 1 }}
              </span>
              <img :src="trackItem.snippet.thumbnails.medium.url" class="w-11 h-11 rounded-lg object-cover bg-zinc-800 border border-white/5 flex-shrink-0" alt="Cover" />
              <div class="min-w-0">
                <p class="text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors">{{ trackItem.snippet.title }}</p>
                <p class="text-xs text-zinc-400 truncate mt-0.5">{{ trackItem.snippet.channelTitle }}</p>
              </div>
            </div>

            <button class="p-2 rounded-full bg-zinc-800 text-zinc-400 opacity-60 group-hover:opacity-100 group-hover:bg-white group-hover:text-black transition-all mr-1">
              <Icon name="solar:play-bold" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
    
    <!-- ================== RESULTS STATE: HASIL PENCARIAN AKTIF ================== -->
    <div v-else>
      <h2 class="text-xl sm:text-2xl font-black text-white mb-6 tracking-tight">
        Hasil teratas untuk "<span class="text-rose-500">{{ searchStore.search }}</span>"
      </h2>
      
      <!-- Loading State Animasi Bar -->
      <div v-if="loading && tracks.length === 0" class="flex flex-col items-center justify-center py-24 text-rose-500 animate-pulse text-sm gap-3">
        <Icon name="solar:refresh-bold" class="animate-spin w-8 h-8 text-rose-500" />
        <span class="font-bold text-zinc-400 text-xs uppercase tracking-wider">Menjelajahi Galaksi Musik...</span>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-xl text-center flex items-center justify-center gap-2 max-w-md mx-auto my-12">
        <Icon name="solar:danger-circle-bold" class="w-4 h-4" />
        <span>Gagal memuat hasil pencarian. Silakan periksa konfigurasi server Anda.</span>
      </div>
      
      <!-- Hasil List Komponen -->
      <div v-else>
        <SharedTrackList :tracks="tracks" />
        
        <!-- Infinite Scroll / Load More Button -->
        <div class="mt-8 flex justify-center pb-4" v-if="nextPageToken">
          <button 
            @click="fetchTracks(true)" 
            :disabled="loading"
            class="px-6 py-2.5 rounded-full border border-white/10 bg-zinc-900/60 text-white font-bold text-xs uppercase tracking-wider hover:border-rose-500/40 hover:bg-zinc-900 transition-all disabled:opacity-50 active:scale-95 shadow-xl"
          >
            {{ loading ? 'Memuat...' : 'Tampilkan Lebih Banyak' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>