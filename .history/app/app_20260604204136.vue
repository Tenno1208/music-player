<script setup>
import { usePlayerStore } from '@/stores/player'

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

    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div 
        v-if="player.currentTrack" 
        class="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 p-4 md:p-5 z-50 shadow-2xl"
      >
        <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div class="flex items-center space-x-4 w-full sm:w-1/3">
            <img 
              :src="player.currentTrack.cover" 
              alt="Playing Cover" 
              class="h-12 w-12 rounded-lg object-cover border border-zinc-800 animate-spin-slow"
              :style="{ animationPlayState: player.isPlaying ? 'running' : 'paused' }"
            />
            <div class="overflow-hidden">
              <p class="font-bold text-sm text-white truncate">{{ player.currentTrack.name }}</p>
              <p class="text-xs text-zinc-400 truncate mt-0.5">{{ player.currentTrack.artist_name }}</p>
            </div>
          </div>

          <div class="flex flex-col items-center w-full sm:w-1/2 max-w-xl">
            <div class="flex items-center space-x-6 mb-2">
              <button class="text-zinc-500 hover:text-white transition text-xs font-bold">&lsaquo;&lsaquo; Prev</button>
              
              <button 
                @click="player.togglePlay()" 
                class="bg-white hover:bg-zinc-200 text-black h-10 w-10 rounded-full flex items-center justify-center font-black text-xs tracking-tighter hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
              >
                {{ player.isPlaying ? 'PAUS' : 'MAIN' }}
              </button>
              
              <button class="text-zinc-500 hover:text-white transition text-xs font-bold">Next &rsaquo;&rsaquo;</button>
            </div>

            <div class="flex items-center space-x-3 w-full text-xs font-mono text-zinc-500">
              <span>{{ player.formatTime(player.progress) }}</span>
              <input 
                type="range" 
                min="0" 
                :max="player.duration" 
                :value="player.progress" 
                @input="(e) => player.seek(Number(e.target.value))"
                class="flex-1 accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer appearance-none outline-none focus:accent-emerald-400"
              />
              <span>{{ player.formatTime(player.duration) }}</span>
            </div>
          </div>

          <div class="hidden sm:flex items-center justify-end w-1/3 text-xs font-mono text-zinc-500">
            <span class="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold tracking-wider uppercase text-[10px]">
              Self-Hosted
            </span>
          </div>

        </div>
      </div>
    </Transition>

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