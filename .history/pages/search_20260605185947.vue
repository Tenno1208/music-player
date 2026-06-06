<script setup>
import { ref, watch, onMounted } from 'vue'

const search = ref('')
const tracks = ref([])
const nextPageToken = ref('')
const loading = ref(false)
const error = ref(false)

const fetchTracks = async (isLoadMore = false) => {
  if (!search.value.trim() && !isLoadMore) {
    tracks.value = []
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

// Listen to Topbar search input
onMounted(() => {
  const searchInput = document.getElementById('global-search')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      search.value = e.target.value
    })
    // Also focus it
    searchInput.focus()
  }
})
</script>

<template>
  <div class="px-6 py-6">
    <div v-if="!search" class="pt-10 text-center">
      <h2 class="text-2xl font-bold text-white mb-2">Search for music</h2>
      <p class="text-zinc-400 text-sm">Find your favorite songs, artists, albums, and more.</p>
    </div>
    
    <div v-else>
      <h2 class="text-2xl font-bold text-white mb-6">Top results for "{{ search }}"</h2>
      
      <div v-if="loading && tracks.length === 0" class="text-zinc-400 text-sm animate-pulse">
        Searching universe...
      </div>
      
      <div v-else-if="error" class="text-red-500 text-sm">
        Failed to load results.
      </div>
      
      <div v-else>
        <SharedTrackList :tracks="tracks" />
        
        <div class="mt-8 flex justify-center pb-8" v-if="nextPageToken">
          <button 
            @click="fetchTracks(true)" 
            :disabled="loading"
            class="px-6 py-2 rounded-full border border-white/20 text-white font-semibold text-sm hover:border-white hover:scale-105 transition-all disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
