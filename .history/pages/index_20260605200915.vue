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

const fetchSpotifyKatalog = async () => {
  loadingSpotify.value = true
  try {
    // 1. Ambil data artis secara terpisah (Satu request per artis agar tidak kena 403)
    const listArtis = ['Tulus', 'Mahalini', 'Nadin Amizah', 'Hindia', 'Rizky Febian']
    
    const artistPromises = listArtis.map(namaArtis => 
      $fetch('/api/spotify', {
        query: { q: namaArtis, type: 'artist' }
      })
    )
    
    const artistResults = await Promise.all(artistPromises)
    // Gabungkan hasil item pertama dari tiap pencarian musisi
    popularArtists.value = artistResults
      .map(res => res.items?.[0])
      .filter(item => item !== undefined)

    // 2. Ambil rilis album terpopuler (Gunakan kata kunci umum yang bersih)
    const albumData = await $fetch('/api/spotify', {
      query: { q: 'pop indonesia', type: 'album' } // Jangan pakai query tag yang sensitif
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
</template><script setup>
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

const fetchSpotifyKatalog = async () => {
  loadingSpotify.value = true
  try {
    // 1. Ambil data artis secara terpisah (Satu request per artis agar tidak kena 403)
    const listArtis = ['Tulus', 'Mahalini', 'Nadin Amizah', 'Hindia', 'Rizky Febian']
    
    const artistPromises = listArtis.map(namaArtis => 
      $fetch('/api/spotify', {
        query: { q: namaArtis, type: 'artist' }
      })
    )
    
    const artistResults = await Promise.all(artistPromises)
    // Gabungkan hasil item pertama dari tiap pencarian musisi
    popularArtists.value = artistResults
      .map(res => res.items?.[0])
      .filter(item => item !== undefined)

    // 2. Ambil rilis album terpopuler (Gunakan kata kunci umum yang bersih)
    const albumData = await $fetch('/api/spotify', {
      query: { q: 'pop indonesia', type: 'album' } // Jangan pakai query tag yang sensitif
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