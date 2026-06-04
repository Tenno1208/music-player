<script setup>
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()

// Mengambil data musik dari Bridge API lokal (bebas dari CORS)
const { data: musicData, error } = await useFetch('/api/tracks')
const tracks = musicData.value?.results || []
</script>

<template>
  <NuxtLayout>
    <iframe 
      v-if="player.currentTrack && player.isPlaying"
      :src="`https://www.youtube.com/embed/${player.currentTrack.youtube_id}?autoplay=1&enablejsapi=1`"
      allow="autoplay"
      class="fixed opacity-0 pointer-events-none w-0 h-0"
    ></iframe>

    <div v-if="player.currentTrack" class="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 p-4 z-50">
      <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div class="flex items-center space-x-3 w-full sm:w-1/3">
          <img :src="player.currentTrack.cover" class="h-10 w-10 rounded-md object-cover" />
          <div class="overflow-hidden">
            <p class="font-bold text-sm text-white truncate">{{ player.currentTrack.name }}</p>
            <p class="text-xs text-zinc-400 truncate">{{ player.currentTrack.artist_name }}</p>
          </div>
        </div>

        <div class="flex flex-col items-center w-full sm:w-1/2">
          <button @click="player.togglePlay()" class="bg-white text-black h-9 w-9 rounded-full font-black text-xs mb-2 transition hover:scale-105 active:scale-95">
            {{ player.isPlaying ? 'PAUS' : 'PLAY' }}
          </button>
          <span class="text-[10px] text-zinc-500 font-mono">Streaming Source: YouTube Player API</span>
        </div>

        <div class="hidden sm:block text-right w-1/3">
          <span class="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-emerald-400 font-mono">FULL AI / CLOUD</span>
        </div>

      </div>
    </div>

    <div class="h-24"></div>
  </NuxtLayout>
</template>

<style>
/* Animasi putaran smooth untuk cover lagu ala vinyl record player */
.animate-spin-slow {
  animation: spin 20s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>