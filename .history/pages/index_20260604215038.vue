<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const search = ref('')
const audioPlayer = ref(null)

const { data: musicData, error } = await useFetch('/api/tracks')

const tracks = computed(() => musicData.value?.items || [])

const filteredTracks = computed(() => {
  if (!search.value) return tracks.value

  return tracks.value.filter(track =>
    track.title?.toLowerCase().includes(search.value.toLowerCase()) ||
    track.user?.name?.toLowerCase().includes(search.value.toLowerCase())
  )
})

watch(
  () => player.currentTrack,
  async () => {
    if (!audioPlayer.value || !player.currentTrack) return

    audioPlayer.value.load()

    try {
      await audioPlayer.value.play()
    } catch (err) {
      console.log(err)
    }
  }
)

watch(
  () => player.isPlaying,
  async (playing) => {
    if (!audioPlayer.value) return

    if (playing) {
      try {
        await audioPlayer.value.play()
      } catch (err) {
        console.log(err)
      }
    } else {
      audioPlayer.value.pause()
    }
  }
)
</script>

<template>

  <header class="mb-10">
    <div
      class="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-10"
    >
      <h1 class="text-5xl font-black mb-4">
        Discover New Music
      </h1>

      <p class="text-white/80">
        Streaming music modern dengan Audius API
      </p>
    </div>
  </header>

  <div class="mb-8">
    <input
      v-model="search"
      type="text"
      placeholder="Cari lagu atau artis..."
      class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white"
    />
  </div>

  <div
    v-if="error"
    class="bg-red-900/40 p-4 rounded-xl mb-6"
  >
    Gagal mengambil data lagu
  </div>

  <div class="mb-6 flex justify-between">

    <h2 class="text-2xl font-bold">
      Trending Tracks
    </h2>

    <span class="text-zinc-400">
      {{ filteredTracks.length }} Lagu
    </span>

  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  >

    <div
      v-for="track in filteredTracks"
      :key="track.id"
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

  <div
    v-if="player.currentTrack"
    class="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-zinc-800 p-4"
  >

    <div
      class="max-w-7xl mx-auto flex items-center justify-between"
    >

      <div class="flex items-center gap-4">

        <img
          :src="player.currentTrack.artwork?.['480x480']"
          class="w-14 h-14 rounded-xl object-cover"
        >

        <div>

          <h3 class="font-bold">
            player.currentTrack.snippet.title
          </h3>

          <p class="text-zinc-400 text-sm">
            {{ player.currentTrack.user?.name }}
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

  <iframe
  v-if="player.currentTrack && player.isPlaying"
  :src="`https://www.youtube.com/embed/${player.currentTrack.id.videoId}?autoplay=1`"
  allow="autoplay"
  class="fixed opacity-0 pointer-events-none w-0 h-0"
/>

  <div class="h-32"></div>

</template>