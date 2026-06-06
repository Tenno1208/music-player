<template>
  <div class="min-h-screen bg-[#121212] text-white p-6 md:p-10 flex flex-col">
    <button @click="$router.back()" class="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors self-start">
      <Icon name="solar:alt-arrow-left-bold" class="w-6 h-6" />
      <span class="font-bold">Kembali</span>
    </button>

    <div v-if="pending" class="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-400">
      <Icon name="solar:refresh-bold" class="animate-spin w-8 h-8 text-rose-500" />
      <p class="text-sm font-medium">Memuat data asli dari Spotify...</p>
    </div>

    <div v-else-if="error || !artistInfo" class="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
      <Icon name="solar:danger-circle-bold" class="w-12 h-12 text-zinc-600" />
      <h3 class="text-lg font-bold text-zinc-300">Gagal Memuat Profil</h3>
      <p class="text-xs text-zinc-500 max-w-xs">Data profil orisinal tidak ditemukan atau API Spotify lokal Anda mengalami gangguan.</p>
    </div>

    <template v-else>
      <div class="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 text-center md:text-left">
        <div class="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/5 flex-shrink-0 bg-zinc-900">
          <img v-if="artistInfo.image" :src="artistInfo.image" class="w-full h-full object-cover" :alt="artistInfo.name" />
          <div v-else class="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
            <Icon name="solar:user-bold" class="w-12 h-12" />
          </div>
        </div>
        <div class="flex flex-col justify-center mt-4 min-w-0">
          <h1 class="text-4xl md:text-5xl font-black mb-2 tracking-tight truncate">{{ artistInfo.name }}</h1>
          <p class="text-rose-400 font-bold text-sm flex items-center justify-center md:justify-start gap-1">
            <Icon name="solar:verified-check-bold" class="w-4 h-4" />
            <span>Artis Terverifikasi Spotify (Popularitas: #{{ artistInfo.popularity }})</span>
          </p>
          <div class="mt-6 flex gap-3 justify-center md:justify-start">
            <button class="bg-rose-500 hover:bg-rose-600 px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-rose-500/20">
              Ikuti Artis
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-black tracking-tight border-b border-white/5 pb-2 text-zinc-300">Lagu Terpopuler</h2>
        
        <div v-if="!artistInfo.topTracks || artistInfo.topTracks.length === 0" class="p-8 rounded-2xl bg-white/5 text-center text-zinc-500 text-xs">
          <Icon name="solar:music-notes-linear" class="w-6 h-6 mx-auto mb-2 text-zinc-600" />
          Tidak ada daftar lagu populer yang dikembalikan dari API Spotify Anda.
        </div>

        <div v-else class="space-y-2">
          <div 
            v-for="(track, index) in artistInfo.topTracks" 
            :key="index"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
          >
            <span class="text-zinc-500 font-bold w-6 text-center group-hover:text-rose-400 transition-colors">{{ index + 1 }}</span>
            <img :src="track.albumCover" class="w-12 h-12 rounded-lg object-cover bg-zinc-800 border border-white/5" alt="Album" />
            <div class="flex-1 min-w-0">
              <p class="font-bold text-white truncate group-hover:text-rose-400 transition-colors">{{ track.title }}</p>
              <p class="text-zinc-400 text-xs truncate mt-0.5">{{ artistInfo.name }}</p>
            </div>
            <Icon name="solar:play-bold" class="w-5 h-5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 group-hover:text-rose-500" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const artistId = route.params.id
const artistName = route.query.name

const { data: artistInfo, pending, error } = await useAsyncData(
  `artist-${artistId}`,
  async () => {
    try {
      const res = await $fetch('/api/spotify', {
        query: {
          q: artistName
        }
      })

      if (!res) return null

      return {
        name: res.name,
        image: res.image,
        popularity: res.popularity || '0',
        topTracks: res.topTracks || []
      }
    } catch (err) {
      console.error(err)
      throw new Error('Gagal memproses data API Spotify')
    }
  }
)
</script>