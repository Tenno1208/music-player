<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 pb-32 md:pb-40">
    <HomeHeroBanner />

    <div class="px-4 sm:px-6 space-y-10">
      
      <div v-if="loadingSpotify" class="flex items-center gap-2 text-rose-500 animate-pulse text-sm py-4">
        <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        Menghubungkan ke database Spotify...
      </div>
      
      <template v-else>
        <HomeCategoryRow 
          v-if="popularArtists.length > 0" 
          title="Popular Artists" 
          :items="popularArtists" 
          :isArtist="true" 
        />
        
        <HomeCategoryRow 
          v-if="popularAlbums.length > 0" 
          title="Popular Albums" 
          :items="popularAlbums" 
          :isArtist="false" 
        />
      </template>

      <div class="mb-10">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight px-4 sm:px-0">
          Trending Now
        </h2>
        
        <div v-if="loadingTracks" class="flex items-center gap-2 text-rose-500 animate-pulse text-sm py-4">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          Loading streaming tracks...
        </div>
        
        <div v-else-if="error" class="text-red-500 text-sm py-4">
          Failed to load trending tracks.
        </div>
        
        <SharedTrackList v-else :tracks="tracks" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tracks = ref([])
const popularArtists = ref([])
const popularAlbums = ref([])

const loadingTracks = ref(false)
const loadingSpotify = ref(false)
const error = ref(false)

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
    const listArtis = ['Tulus', 'Mahalini', 'Nadin Amizah', 'Hindia', 'Rizky Febian']
    
    // 1. Ambil data artis
    const artistPromises = listArtis.map(namaArtis => 
      $fetch('/api/spotify', { query: { q: namaArtis, type: 'artist' } })
    )
    
    const artistResults = await Promise.all(artistPromises)
    
    // PEMETAAN BARU: Menyesuaikan struktur raw data Spotify (.artists.items)
    popularArtists.value = artistResults
      .map(res => {
        const artist = res.artists?.items?.[0]
        if (!artist) return undefined
        return {
          name: artist.name,
          description: 'Artist',
          // Ambil gambar pertama, jika tidak ada pakai gambar placeholder default
          image: artist.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200'
        }
      })
      .filter(item => item !== undefined)

    // 2. Ambil data album terpopuler
    const albumData = await $fetch('/api/spotify', { query: { q: 'pop indonesia', type: 'album' } })
    
    // PEMETAAN BARU: Menyesuaikan struktur raw data Spotify (.albums.items)
    const rawAlbums = albumData.albums?.items || []
    popularAlbums.value = rawAlbums.map(album => ({
      name: album.name,
      // Menggabungkan nama-nama artis jika album memiliki kolaborasi masal
      description: album.artists?.map(a => a.name).join(', ') || 'Various Artists',
      image: album.images?.[0]?.url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200'
    }))

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