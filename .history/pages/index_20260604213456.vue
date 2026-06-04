<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const search = ref('')
const audioPlayer = ref(null)

const { data: musicData, error } = await useFetch('/api/tracks')

const tracks = computed(() => musicData.value?.results || [])

const filteredTracks = computed(() => {
  if (!search.value) return tracks.value

  return tracks.value.filter(track =>
    track.name?.toLowerCase().includes(search.value.toLowerCase()) ||
    track.artist_name?.toLowerCase().includes(search.value.toLowerCase())
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
      console.error(err)
    }
  }
)

watch(
  () => player.isPlaying,
  async (playing) => {
    if (!audioPlayer.value) return

    try {
      if (playing) {
        await audioPlayer.value.play()
      } else {
        audioPlayer.value.pause()
      }
    } catch (err) {
      console.error(err)
    }
  }
)
</script>

<template>

    <!-- HERO -->
    <header class="mb-10">

      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-10 md:p-14"
      >

        <div class="absolute inset-0 bg-black/10"></div>

        <div class="relative z-10">
          <p class="uppercase tracking-[0.4em] text-xs text-white/70 mb-4">
            Premium Music Experience
          </p>

          <h1 class="text-4xl md:text-6xl font-black text-white mb-4">
            Discover New Music
          </h1>

          <p class="max-w-2xl text-white/80">
            Dengarkan musik favoritmu tanpa ribet dengan tampilan modern,
            cepat, dan elegan.
          </p>
        </div>

      </div>

    </header>

    <!-- SEARCH -->
    <div class="mb-8">

      <input
        v-model="search"
        type="text"
        placeholder="Cari lagu atau artis..."
        class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500"
      />

    </div>

    <!-- ERROR -->
    <div
      v-if="error"
      class="bg-red-900/40 border border-red-700 text-red-300 rounded-xl p-4 mb-6"
    >
      Gagal mengambil data lagu.
    </div>

    <!-- TITLE -->
    <div class="flex items-center justify-between mb-6">

      <h2 class="text-2xl font-bold">
        Trending Tracks
      </h2>

      <span class="text-zinc-500 text-sm">
        {{ filteredTracks.length }} Lagu
      </span>

    </div>

    <!-- GRID -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >

      <div
        v-for="track in filteredTracks"
        :key="track.id"
        @click="player.playTrack(track)"
        class="group bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-300"
      >

        <div class="relative">

          <img
            :src="track.artwork?.['480x480']"
            class="w-full h-56 object-cover"
            @error="$event.target.src='https://placehold.co/500x500?text=No+Cover'"
          />

          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
          ></div>

          <div
            class="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold opacity-0 group-hover:opacity-100 transition"
          >
            ▶
          </div>

        </div>

        <div class="p-5">

          <h3 class="font-bold text-white truncate">
            {{ track.name }}
          </h3>

          <p class="text-zinc-400 text-sm mt-1 truncate">
            {{ track.artist_name }}
          </p>

        </div>

      </div>

    </div>

    <!-- PLAYER -->
    <div
      v-if="player.currentTrack"
      class="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-zinc-800 p-4 z-50"
    >

      <div
        class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
      >

        <div class="flex items-center gap-4">

          <img
            :src="player.currentTrack.image"
            class="w-14 h-14 rounded-xl object-cover"
          />

          <div>

            <h3 class="font-semibold text-white">
              {{ player.currentTrack.name }}
            </h3>

            <p class="text-zinc-400 text-sm">
              {{ player.currentTrack.artist_name }}
            </p>

          </div>

        </div>

        <button
          @click="player.togglePlay()"
          class="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3 rounded-full transition"
        >
          {{ player.isPlaying ? 'Pause' : 'Play' }}
        </button>

      </div>

    </div>

    <!-- AUDIO -->
    <audio
      ref="audioPlayer"
      :src="player.currentTrack?.audio"
      controls
      autoplay
      class="fixed bottom-28 left-4 z-40"
    />

    <div class="h-40"></div>

</template>

<style>
html {
  scroll-behavior: smooth;
}

body {
  background: #09090b;
}
</style>