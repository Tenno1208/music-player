<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const search = ref('')
const tracks = ref([])
const nextPageToken = ref('')
const loading = ref(false)
const error = ref(null)

const fetchTracks = async (reset = false) => {
  loading.value = true

  try {
    const data = await $fetch('/api/tracks', {
      query: {
        q: search.value || 'official music video',
        pageToken: reset ? '' : nextPageToken.value
      }
    })

    if (reset) {
      tracks.value = data.items || []
    } else {
      tracks.value.push(...(data.items || []))
    }

    nextPageToken.value = data.nextPageToken || ''
  } catch (err) {
    console.error(err)
    error.value = err
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTracks(true)
})

let timeout = null

watch(search, () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    fetchTracks(true)
  }, 500)
})

const filteredTracks = computed(() => tracks.value)
</script>

<template>
  <div>
    <!-- HERO -->
    <header class="mb-10">
      <div
        class="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-10"
      >
        <h1 class="text-5xl font-black mb-4 text-white">
          Discover New Music
        </h1>

        <p class="text-white/80">
          Search dan streaming musik dari YouTube
        </p>
      </div>
    </header>

    <!-- SEARCH -->
    <div class="mb-8">
      <input
        v-model="search"
        type="text"
        placeholder="Cari lagu atau artis..."
        class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none"
      />
    </div>

    <!-- ERROR -->
    <div
      v-if="error"
      class="bg-red-900/40 p-4 rounded-xl mb-6"
    >
      Gagal mengambil data lagu
    </div>

    <!-- HEADER -->
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        Music
      </h2>

      <span class="text-zinc-400">
        {{ filteredTracks.length }} Lagu
      </span>
    </div>

    <!-- GRID -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="track in filteredTracks"
        :key="track.etag"
        @click="player.playTrack(track)"
        class="bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
      >
        <img
          :src="track.snippet?.thumbnails?.high?.url"
          class="w-full h-56 object-cover"
        >

        <div class="p-4">
          <h3 class="font-bold truncate">
            {{ track.snippet?.title }}
          </h3>

          <p class="text-zinc-400 text-sm truncate">
            {{ track.snippet?.channelTitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- LOAD MORE -->
    <div class="flex justify-center mt-10">
      <button
        v-if="nextPageToken"
        @click="fetchTracks()"
        :disabled="loading"
        class="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl"
      >
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
    </div>

    <!-- PLAYER -->
    <div
      v-if="player.currentTrack"
      class="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-zinc-800 p-4"
    >
      <div
        class="max-w-7xl mx-auto flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <img
            :src="player.currentTrack.snippet.thumbnails.high.url"
            class="w-14 h-14 rounded-xl object-cover"
          >

          <div>
            <h3 class="font-bold">
              {{ player.currentTrack.snippet.title }}
            </h3>

            <p class="text-zinc-400 text-sm">
              {{ player.currentTrack.snippet.channelTitle }}
            </p>
          </div>
        </div>

        <button
          @click="player.togglePlay()"
          class="bg-emerald-500 text-black px-6 py-3 rounded-full font-bold"
        >
          {{ player.isPlaying ? 'Pause' : 'Play' }}
        </button>
      </div>
    </div>

    <!-- YOUTUBE PLAYER -->
    <iframe
      v-if="player.currentTrack"
      :src="`https://www.youtube.com/embed/${player.currentTrack.id.videoId}?autoplay=${player.isPlaying ? 1 : 0}`"
      allow="autoplay"
      class="fixed opacity-0 pointer-events-none w-0 h-0"
    />

    <div class="h-32"></div>
  </div>
</template>