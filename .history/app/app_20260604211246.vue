<script setup>
import { ref, computed, watch } from 'vue'
<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

const { data: musicData, error } = await useFetch('/api/tracks')

const tracks = computed(() => musicData.value?.results || [])

const audioPlayer = ref(null)

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

    if (playing) {
      try {
        await audioPlayer.value.play()
      } catch (err) {
        console.error(err)
      }
    } else {
      audioPlayer.value.pause()
    }
  }
)
</script>

<template>
  <NuxtLayout>

    <header class="mb-10">
      <h1 class="text-3xl font-bold text-white">
        Nuxt Music
      </h1>
      <p class="text-zinc-400">
        Streaming dari Jamendo API
      </p>
    </header>

    <div
      v-if="error"
      class="bg-red-900 text-white p-4 rounded-lg"
    >
      Gagal memuat lagu
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div
        v-for="track in tracks"
        :key="track.id"
        @click="player.playTrack(track)"
        class="bg-zinc-900 p-4 rounded-xl cursor-pointer hover:bg-zinc-800 transition"
      >

        <img
          :src="track.image"
          class="w-full h-40 object-cover rounded-lg mb-3"
          @error="$event.target.src='https://placehold.co/400x400?text=No+Image'"
        >

        <h3 class="font-bold text-white">
          {{ track.name }}
        </h3>

        <p class="text-zinc-400 text-sm">
          {{ track.artist_name }}
        </p>

      </div>

    </div>

    <div
      v-if="player.currentTrack"
      class="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4"
    >
      <div class="max-w-5xl mx-auto flex items-center justify-between">

        <div>
          <div class="text-white font-semibold">
            {{ player.currentTrack.name }}
          </div>

          <div class="text-zinc-400 text-sm">
            {{ player.currentTrack.artist_name }}
          </div>
        </div>

        <button
          @click="player.togglePlay()"
          class="bg-white text-black px-4 py-2 rounded-lg"
        >
          {{ player.isPlaying ? 'Pause' : 'Play' }}
        </button>

      </div>
    </div>

    <audio
      ref="audioPlayer"
      :src="player.currentTrack?.audio"
      controls
      autoplay
      class="fixed bottom-24 left-4 z-50"
    />

  </NuxtLayout>
</template>
const player = usePlayerStore()

const { data: musicData, error } = await useFetch('/api/tracks')

const tracks = computed(() => musicData.value?.results || [])

const audioPlayer = ref(null)

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

    if (playing) {
      try {
        await audioPlayer.value.play()
      } catch (err) {
        console.error(err)
      }
    } else {
      audioPlayer.value.pause()
    }
  }
)
</script>

<template>
  <NuxtLayout>

    <header class="mb-10">
      <h1 class="text-3xl font-bold text-white">
        Nuxt Music
      </h1>
      <p class="text-zinc-400">
        Streaming dari Jamendo API
      </p>
    </header>

    <div
      v-if="error"
      class="bg-red-900 text-white p-4 rounded-lg"
    >
      Gagal memuat lagu
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div
        v-for="track in tracks"
        :key="track.id"
        @click="player.playTrack(track)"
        class="bg-zinc-900 p-4 rounded-xl cursor-pointer hover:bg-zinc-800 transition"
      >

        <img
          :src="track.image"
          class="w-full h-40 object-cover rounded-lg mb-3"
          @error="$event.target.src='https://placehold.co/400x400?text=No+Image'"
        >

        <h3 class="font-bold text-white">
          {{ track.name }}
        </h3>

        <p class="text-zinc-400 text-sm">
          {{ track.artist_name }}
        </p>

      </div>

    </div>

    <div
      v-if="player.currentTrack"
      class="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4"
    >
      <div class="max-w-5xl mx-auto flex items-center justify-between">

        <div>
          <div class="text-white font-semibold">
            {{ player.currentTrack.name }}
          </div>

          <div class="text-zinc-400 text-sm">
            {{ player.currentTrack.artist_name }}
          </div>
        </div>

        <button
          @click="player.togglePlay()"
          class="bg-white text-black px-4 py-2 rounded-lg"
        >
          {{ player.isPlaying ? 'Pause' : 'Play' }}
        </button>

      </div>
    </div>

    <audio
      ref="audioPlayer"
      :src="player.currentTrack?.audio"
      controls
      autoplay
      class="fixed bottom-24 left-4 z-50"
    />

  </NuxtLayout>
</template>