<script setup>
import { ref, onMounted } from 'vue'

const tracks = ref([])
const popularArtists = ref([])
const popularAlbums = ref([])

const loadingTracks = ref(false)
const loadingArtists = ref(false)
const loadingAlbums = ref(false)
const error = ref(false)

// 1. Fetch Trending Tracks
const fetchTrending = async () => {
  loadingTracks.value = true
  error.value = false
  try {
    const data = await $fetch('/api/tracks', { 
      query: { q: 'top hits indonesia 2026', maxResults: 10 } 
    })
    tracks.value = data.items || []
  } catch (err) {
    console.error('Error tracks:', err)
    error.value = true
  } finally {
    loadingTracks.value = false
  }
}

// 2. Fetch Popular Artists (Mengambil tipe Channel dari YouTube)
const fetchPopularArtists = async () => {
  loadingArtists.value = true
  try {
    // Kita cari channel artis-artis besar Indonesia
    const data = await $fetch('/api/tracks', {
      query: { q: 'Tulus Mahalini Nadin Amizah Hindia Rizky Febian', maxResults: 6 }
    })
    
    // Map data agar sesuai dengan struktur objek komponen HomeCategoryRow
    popularArtists.value = (data.items || []).map(item => ({
      name: item.snippet?.channelTitle || 'Unknown Artist',
      description: 'Artis Resmi',
      image: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
      isArtist: true
    }))
  } catch (err) {
    console.error('Error artists:', err)
  } finally {
    loadingArtists.value = false
  }
}

// 3. Fetch Popular Albums / Playlists
const fetchPopularAlbums = async () => {
  loadingAlbums.value = true
  try {
    const data = await $fetch('/api/tracks', {
      query: { q: 'album indonesia populer full album', maxResults: 6 }
    })
    
    popularAlbums.value = (data.items || []).map(item => ({
      name: item.snippet?.title?.replace(/full album|official|playlist/gi, '') || 'Koleksi Musik',
      description: item.snippet?.channelTitle,
      image: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
      isArtist: false
    }))
  } catch (err) {
    console.error('Error albums:', err)
  } finally {
    loadingAlbums.value = false
  }
}

onMounted(() => {
  fetchTrending()
  fetchPopularArtists()
  fetchPopularAlbums()
})
</script>

<template>
  <div>
    <!-- Hero Header Component -->
    <HomeHeroBanner />

    <div class="px-6 space-y-10">
      
      <!-- Top Artists Section -->
      <div v-if="loadingArtists" class="text-rose-500 animate-pulse text-sm px-2">Menyelaraskan data musisi...</div>
      <HomeCategoryRow 
        v-else-if="popularArtists.length > 0" 
        title="Popular Artists" 
        :items="popularArtists" 
        :isArtist="true" 
      />
      
      <!-- Popular Albums Section -->
      <div v-if="loadingAlbums" class="text-rose-500 animate-pulse text-sm px-2">Mengumpulkan cover album...</div>
      <HomeCategoryRow 
        v-else-if="popularAlbums.length > 0" 
        title="Popular Albums" 
        :items="popularAlbums" 
        :isArtist="false" 
      />

      <!-- Trending Tracks Section -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-white hover:underline cursor-pointer mb-4 tracking-tight">Trending Now</h2>
        
        <div v-if="loadingTracks" class="text-rose-500 animate-pulse text-sm px-2">Memuat daftar putar terhangat...</div>
        <div v-else-if="error" class="text-red-500 text-sm px-2">Gagal memuat track trending.</div>
        
        <SharedTrackList v-else :tracks="tracks" />
      </div>

    </div>
  </div>
</template>