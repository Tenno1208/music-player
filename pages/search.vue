<script setup>
import { watch, onMounted } from 'vue'
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()
const tracks = ref([])
const nextPageToken = ref('')
const loading = ref(false)
const error = ref(false)

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

// Watch data search dari global store Pinia
let debounceTimeout = null
watch(() => searchStore.search, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchTracks(false)
  }, 500)
})

// Jika user masuk ke halaman search dan sudah ada teks terisi, langsung eksekusi pencarian
onMounted(() => {
  if (searchStore.search) {
    fetchTracks(false)
  }
})
</script>

<template>
  <div class="px-4 sm:px-6 py-6">
    <!-- Default State jika pencarian kosong -->
    <div v-if="!searchStore.search.trim()" class="pt-20 text-center max-w-sm mx-auto">
      <div class="w-16 h-16 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-500">
        <Icon name="solar:music-library-2-bold-duotone" class="w-8 h-8" />
      </div>
      <h2 class="text-xl font-bold text-white mb-1 tracking-tight">Search for music</h2>
      <p class="text-zinc-500 text-xs sm:text-sm">Find your favorite songs, artists, albums, and more.</p>
    </div>
    
    <!-- Results State -->
    <div v-else>
      <h2 class="text-xl sm:text-2xl font-bold text-white mb-6 tracking-tight">
        Top results for "<span class="text-rose-500">{{ searchStore.search }}</span>"
      </h2>
      
      <!-- Loading State -->
      <div v-if="loading && tracks.length === 0" class="flex flex-col items-center justify-center py-24 text-rose-500 animate-pulse text-sm gap-2">
        <Icon name="svg-spinners:bars-scale-fade" class="w-6 h-6" />
        <span>Searching universe...</span>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-red-500 text-sm py-10 text-center">
        Failed to load results. Please check your configuration.
      </div>
      
      <!-- Hasil Pencarian List -->
      <div v-else>
        <SharedTrackList :tracks="tracks" />
        
        <!-- Infinite / Load More -->
        <div class="mt-8 flex justify-center pb-8" v-if="nextPageToken">
          <button 
            @click="fetchTracks(true)" 
            :disabled="loading"
            class="px-6 py-2.5 rounded-xl border border-white/10 bg-zinc-900/60 text-white font-semibold text-xs sm:text-sm hover:border-rose-500/50 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Load More Results' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>