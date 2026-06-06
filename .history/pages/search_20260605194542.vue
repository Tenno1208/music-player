<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const search = ref('')
const tracks = ref([])
const nextPageToken = ref('')
const loading = ref(false)
const error = ref(false)

const fetchTracks = async (isLoadMore = false) => {
  if (!search.value.trim()) {
    if (!isLoadMore) tracks.value = []
    return
  }
  
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
    console.error('Search error:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Debounce Watcher agar tidak boros kuota YouTube API tiap kali ketik huruf
let debounceTimeout = null
watch(search, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchTracks(false)
  }, 500)
})

// Penanganan sinkronisasi jika kamu tetap ingin menangkap input dari Topbar global-search
const handleGlobalInput = (e) => {
  search.value = e.target.value
}

onMounted(() => {
  const searchInput = document.getElementById('global-search')
  if (searchInput) {
    searchInput.addEventListener('input', handleGlobalInput)
    searchInput.focus()
  }
})

// Bersihkan listener saat pindah halaman agar memori tidak bocor
onBeforeUnmount(() => {
  const searchInput = document.getElementById('global-search')
  if (searchInput) {
    searchInput.removeEventListener('input', handleGlobalInput)
  }
})
</script>

<template>
  <div class="px-6 py-6">
    <!-- Search Input Lokal (Bypass mandiri jika global-search di topbar tidak aktif/tidak ada) -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
          <Icon name="solar:minimalistic-magnifer-bold-duotone" class="w-5 h-5" />
        </span>
        <input
          v-model="search"
          type="text"
          placeholder="Cari judul lagu, artis, atau genre musik..."
          class="w-full bg-zinc-900/60 border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all duration-300"
        />
        <span 
          v-if="search" 
          @click="search = ''" 
          class="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-white cursor-pointer transition-colors"
        >
          <Icon name="solar:close-circle-bold-duotone" class="w-5 h-5" />
        </span>
      </div>
    </div>

    <!-- Default State (Saat belum mengetik apapun) -->
    <div v-if="!search.trim()" class="pt-16 text-center max-w-sm mx-auto">
      <div class="w-16 h-16 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
        <Icon name="solar:music-library-2-bold-duotone" class="w-8 h-8" />
      </div>
      <h2 class="text-xl font-bold text-white mb-1 tracking-tight">Search for music</h2>
      <p class="text-zinc-500 text-xs sm:text-sm">Find your favorite songs, artists, albums, and more.</p>
    </div>
    
    <!-- Results State -->
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">
          Top results for "<span class="text-rose-400">{{ search }}</span>"
        </h2>
        <span v-if="tracks.length > 0" class="text-xs text-zinc-500 font-medium">
          {{ tracks.length }} video ditemukan
        </span>
      </div>
      
      <!-- Loading Awal -->
      <div v-if="loading && tracks.length === 0" class="flex flex-col items-center justify-center py-20 text-rose-500 animate-pulse text-sm gap-2">
        <Icon name="svg-spinners:bars-scale-fade" class="w-6 h-6" />
        <span>Searching universe...</span>
      </div>
      
      <!-- Error Handler -->
      <div v-else-if="error" class="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-sm text-red-400 flex items-center gap-3">
        <Icon name="solar:danger-triangle-bold-duotone" class="w-5 h-5 flex-shrink-0" />
        Failed to load results. Please check your network connection or API Key.
      </div>
      
      <!-- List Hasil Render -->
      <div v-else>
        <SharedTrackList :tracks="tracks" />
        
        <!-- Load More Button -->
        <div class="mt-10 flex justify-center pb-12" v-if="nextPageToken">
          <button 
            @click="fetchTracks(true)" 
            :disabled="loading"
            class="px-8 py-3 rounded-xl border border-white/10 bg-zinc-900/40 text-zinc-200 font-semibold text-xs sm:text-sm hover:border-rose-500/50 hover:text-white active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Icon v-if="loading" name="svg-spinners:180-ring-with-bg" class="w-4 h-4" />
            <span>{{ loading ? 'Loading...' : 'Load More Results' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>