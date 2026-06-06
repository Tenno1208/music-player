<script setup>
import { ref, onMounted } from 'vue'

const tracks = ref([]) // Ini tetap dari YouTube Api kamu
const popularArtists = ref([]) // Dari Spotify
const popularAlbums = ref([]) // Dari Spotify

const loadingTracks = ref(false)
const loadingSpotify = ref(false)
const error = ref(false)

// Fetch data video trending dari YouTube API milikmu
const fetchTrending = async () => {
  loadingTracks.value = true
  error.value = false
  try {
    const data = await $fetch('/api/tracks', { query: { q: 'top hits indonesia 2026', maxResults: 10 } })
    tracks.value = data.items || []
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loadingTracks.value = false
  }
}

// Fetch katalog visual murni dari Spotify API baru kita
const fetchSpotifyKatalog = async () => {
  loadingSpotify.value = true
  try {
    // 1. Ambil data beberapa artis populer Indonesia
    const artistData = await $fetch('/api/spotify', {
      query: { q: 'Tulus Mahalini Nadin Amizah Hindia Rizky Febian', type: 'artist' }
    })
    popularArtists.value = artistData.items || []

    // 2. Ambil rilis album terhangat / terbaru di Indonesia
    const albumData = await $fetch('/api/spotify', {
      query: { q: 'tag:new indonesia', type: 'album' }
    })
    popularAlbums.value = albumData.items || []
    
  } catch (err) {
    console.error('Gagal memuat katalog Spotify:', err)
  } finally {
    loadingSpotify.value = false
  }
}

onMounted(() => {
  fetchTrending()
  fetchSpotifyKatalog()
})
</script>

<template>
  <div>
    <HomeHeroBanner />

    <div class="px-6 space-y-10">
      
      <!-- Section Artis (Data murni & foto bulat rapi dari Spotify) -->
      <div v-if="loadingSpotify" class="text-rose-500 animate-pulse text-sm">Menghubungkan ke database Spotify...</div>
      <template v-else>
        <HomeCategoryRow 
          v-if="popularArtists.length > 0" 
          title="Popular Artists" 
          :items="popularArtists" 
          :isArtist="true" 
        />
        
        <!-- Section Album (Cover kotak HD dari Spotify) -->
        <HomeCategoryRow 
          v-if="popularAlbums.length > 0" 
          title="Popular Albums" 
          :items="popularAlbums" 
          :isArtist="false" 
        />
      </template>

      <!-- Trending Section dari YouTube Player -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-white hover:underline cursor-pointer mb-4 tracking-tight">Trending Now</h2>
        <div v-if="loadingTracks" class="text-rose-500 animate-pulse text-sm">Loading streaming tracks...</div>
        <div v-else-if="error" class="text-red-500 text-sm">Failed to load trending tracks.</div>
        <SharedTrackList v-else :tracks="tracks" />
      </div>

    </div>
  </div>
</template>