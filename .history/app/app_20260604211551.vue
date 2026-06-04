<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '../stores/player'

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
  <div class="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">

    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-zinc-800">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-black">
            N
          </div>

          <div>
            <h1 class="font-bold text-lg">Nuxt Music</h1>
            <p class="text-xs text-zinc-400">
              Streaming Platform
            </p>
          </div>
        </div>

        <div class="hidden md:flex gap-8 text-zinc-400">
          <a href="#" class="hover:text-white">Discover</a>
          <a href="#" class="hover:text-white">Trending</a>
          <a href="#" class="hover:text-white">Artists</a>
        </div>

      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <slot />
    </main>

  </div>
</template>