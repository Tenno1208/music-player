<script setup>
import { ref, onMounted } from 'vue'

const tracks = ref([])
const loading = ref(false)
const error = ref(false)

const fetchTrending = async () => {
  loading.value = true
  error.value = false
  try {
    const data = await $fetch('/api/tracks', { query: { q: 'top hits indonesia 2023', maxResults: 10 } })
    tracks.value = data.items || []
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTrending()
})

const popularArtists = ref([
  { name: 'Tulus', description: 'Artist', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=200&h=200&auto=format&fit=crop', isArtist: true },
  { name: 'Mahalini', description: 'Artist', image: 'https://images.unsplash.com/photo-1516280440502-65f6c5240f8a?q=80&w=200&h=200&auto=format&fit=crop', isArtist: true },
  { name: 'Nadin Amizah', description: 'Artist', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=200&h=200&auto=format&fit=crop', isArtist: true },
  { name: 'Rizky Febian', description: 'Artist', image: 'https://images.unsplash.com/photo-1520625345791-c529ba89e0ff?q=80&w=200&h=200&auto=format&fit=crop', isArtist: true },
  { name: 'Tiara Andini', description: 'Artist', image: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=200&h=200&auto=format&fit=crop', isArtist: true }
])

const popularAlbums = ref([
  { name: 'Monokrom', description: 'Tulus', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Fabula', description: 'Mahalini', image: 'https://images.unsplash.com/photo-1619983081563-430f53602796?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Selamat Ulang Tahun', description: 'Nadin Amizah', image: 'https://images.unsplash.com/photo-1600865510619-a1b414f08e5e?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Berona', description: 'Rizky Febian', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Menjadi Makna', description: 'Hindia', image: 'https://images.unsplash.com/photo-1614613535808-3196b010c2f3?q=80&w=200&h=200&auto=format&fit=crop' }
])
</script>

<template>
  <div>
    <!-- Hero Header Component -->
    <HomeHeroBanner />

    <div class="px-6 space-y-10">
      
      <!-- Top Artists Mock -->
      <HomeCategoryRow title="Popular Artists" :items="popularArtists" :isArtist="true" />
      
      <!-- Popular Albums Mock -->
      <HomeCategoryRow title="Popular Albums" :items="popularAlbums" :isArtist="false" />

      <!-- Trending Tracks from YouTube API -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-white hover:underline cursor-pointer mb-4">Trending Now</h2>
        
        <div v-if="loading" class="text-rose-500 animate-pulse text-sm">Loading tracks...</div>
        <div v-else-if="error" class="text-red-500 text-sm">Failed to load trending tracks.</div>
        
        <SharedTrackList v-else :tracks="tracks" />
      </div>

    </div>
  </div>
</template>
