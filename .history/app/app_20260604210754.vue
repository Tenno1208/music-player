<script setup>
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()

// Mengambil data musik dari Bridge API lokal (bebas dari CORS)
const { data: musicData, error } = await useFetch('/api/tracks')
const tracks = musicData.value?.results || []
</script>

<template>
  <NuxtLayout>
    <header class="mb-10">
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
        Selamat Datang di Ruang Musik Anda
      </h1>
      <p class="text-zinc-400 text-sm md:text-base max-w-xl">
        Dengarkan trek audio pilihan secara instant, murni tanpa interupsi iklan, dikuasai penuh oleh Anda.
      </p>
    </header>

    <div v-if="error" class="p-4 bg-red-950/50 border border-red-900 rounded-xl text-red-400 text-sm mb-6">
      Gagal memuat data lagu. Pastikan server Nuxt berjalan dengan benar.
    </div>

    <section>
      <h2 class="text-xl font-bold text-white mb-4 tracking-tight flex items-center space-x-2">
        <span>Trek Populer Saat Ini</span>
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          v-for="track in tracks" 
          :key="track.id"
          @click="player.playTrack(track)"
          :class="[
            'p-4 rounded-xl cursor-pointer transition-all duration-300 border flex flex-col justify-between group',
            player.currentTrack?.id === track.id 
              ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-950/20' 
              : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-900 hover:border-zinc-800'
          ]"
        >
          <div class="flex items-start space-x-4 mb-4">
            <img 
              :src="track.cover" 
              alt="Cover Image" 
              class="h-14 w-14 rounded-lg object-cover bg-zinc-800 border border-zinc-800 shadow-inner group-hover:scale-105 transition duration-300"
            />
            <div class="overflow-hidden">
              <p class="font-semibold text-zinc-100 truncate group-hover:text-emerald-400 transition">
                {{ track.name }}
              </p>
              <p class="text-xs text-zinc-400 truncate mt-0.5">
                {{ track.artist_name }}
              </p>
              <p class="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mt-1">
                {{ track.album_name }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900">
            <span class="text-xs text-zinc-500">Murni Tanpa Iklan</span>
            <span class="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform duration-300 flex items-center space-x-1">
              <span>{{ player.currentTrack?.id === track.id && player.isPlaying ? 'Muter' : 'Putar' }}</span>
              <span>&rarr;</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <iframe 
      v-if="player.currentTrack && player.isPlaying"
      :src="`https://www.youtube.com/embed/${player.currentTrack.youtube_id}?autoplay=1&enablejsapi=1`"
      allow="autoplay"
      class="fixed opacity-0 pointer-events-none w-0 h-0"
    ></iframe>

    <div v-if="player.currentTrack" class="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 p-4 z-50">
      <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div class="flex items-center space-x-3 w-full sm:w-1/3">
          <img :src="player.currentTrack.cover" class="h-10 w-10 rounded-md object-cover animate-spin-slow" :style="{ animationPlayState: player.isPlaying ? 'running' : 'paused' }" />
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