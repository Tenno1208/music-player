<script setup>
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