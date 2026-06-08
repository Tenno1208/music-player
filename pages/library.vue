<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()

// State untuk mengatur tab kategori perpustakaan yang aktif
const activeLibTab = ref('history')

// Ambil daftar lagu yang disukai dari store player kamu
// (Memastikan store kamu memiliki properti 'likedTracks' atau 'favorites')
const likedTracks = computed(() => {
  return player.likedTracks || player.favorites || []
})

// Simulasi data artis yang diikuti agar halaman tidak kosong saat menu artis dibuka
const followedArtists = ref([
  { name: 'Mahalini', image: 'https://i.scdn.co/image/ab6761610000e5ebd3564043a332daaa882853d6', type: 'Artis Terverifikasi' },
  { name: 'Hindia', image: 'https://i.scdn.co/image/ab6761610000e5ebb786cb6de7505caff17fe11f', type: 'Artis Terverifikasi' },
  { name: 'Rex Orange County', image: 'https://i.scdn.co/image/ab6761610000e5eb901ccc452604c427ef5f202f', type: 'Artis Terverifikasi' }
])
</script>

<template>
  <!-- Padding bawah pb-24 ditambahkan agar tidak tertutup oleh Floating Navbar Mobile -->
  <div class="px-4 sm:px-6 py-6 pb-24 max-w-5xl mx-auto text-zinc-100 selection:bg-rose-600 selection:text-white">
    
    <!-- Header Utama Perpustakaan -->
    <div class="flex items-center gap-4 mb-6">
      <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/20">
        <Icon name="solar:library-bold" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Koleksi Kamu</h1>
        <p class="text-xs sm:text-sm text-zinc-400 font-medium">Perpustakaan musik pribadi Anda</p>
      </div>
    </div>

    <!-- ================== PILIHAN MENU KATEGORI PREMIUM ================== -->
    <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 border-b border-white/5">
      <!-- Menu 1: Riwayat Putar -->
      <button 
        @click="activeLibTab = 'history'"
        class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-2 flex-shrink-0"
        :class="activeLibTab === 'history' 
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
          : 'bg-white/5 border-transparent text-zinc-400 hover:text-white hover:bg-white/10'"
      >
        <Icon name="solar:history-bold" class="w-4 h-4" />
        Riwayat Putar
      </button>

      <!-- Menu 2: Lagu Disukai (Liked Songs) -->
      <button 
        @click="activeLibTab = 'liked'"
        class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-2 flex-shrink-0"
        :class="activeLibTab === 'liked' 
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
          : 'bg-white/5 border-transparent text-zinc-400 hover:text-white hover:bg-white/10'"
      >
        <Icon name="solar:heart-bold" class="w-4 h-4" />
        Lagu Disukai
        <span v-if="likedTracks.length" class="ml-0.5 px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black">
          {{ likedTracks.length }}
        </span>
      </button>

      <!-- Menu 3: Artis Diikuti -->
      <button 
        @click="activeLibTab = 'artists'"
        class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-2 flex-shrink-0"
        :class="activeLibTab === 'artists' 
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
          : 'bg-white/5 border-transparent text-zinc-400 hover:text-white hover:bg-white/10'"
      >
        <Icon name="solar:users-group-rounded-bold" class="w-4 h-4" />
        Artis
      </button>
    </div>

    <!-- ================== KONTEN KONDISIONAL BERDASARKAN TAB ACTIVE ================== -->
    
    <!-- 1. VIEW KATEGORI: RIWAYAT PUTAR (HISTORY) -->
    <div v-if="activeLibTab === 'history'">
      <div v-if="player.history.length === 0" class="text-center py-16 bg-white/[0.01] rounded-2xl border border-white/5 p-6">
        <Icon name="solar:music-notes-linear" class="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <h3 class="text-base font-bold text-zinc-300 mb-1">Belum ada riwayat musik</h3>
        <p class="text-zinc-500 text-xs max-w-xs mx-auto mb-5">Lagu yang Anda putar di platform Noizy akan otomatis terekam rapi di sini.</p>
        <NuxtLink to="/search" class="px-5 py-2.5 bg-white text-black text-xs font-black rounded-full hover:scale-105 transition-transform inline-block uppercase tracking-wider">
          Cari Musik
        </NuxtLink>
      </div>

      <div v-else class="space-y-1">
        <div class="text-zinc-500 text-[10px] font-black uppercase tracking-wider mb-2 px-2">Terakhir Anda Putar</div>
        <SharedTrackList :tracks="player.history" />
      </div>
    </div>

    <!-- 2. VIEW KATEGORI: LAGU DISUKAI (LIKED SONGS) -->
    <div v-else-if="activeLibTab === 'liked'">
      <div v-if="likedTracks.length === 0" class="text-center py-16 bg-gradient-to-b from-rose-950/20 to-transparent rounded-2xl border border-white/5 p-6">
        <div class="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
          <Icon name="solar:heart-broken-bold" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-zinc-300 mb-1">Belum ada lagu disukai</h3>
        <p class="text-zinc-500 text-xs max-w-xs mx-auto mb-5">Tekan ikon hati saat memutar lagu di deck player untuk mengumpulkannya di sini.</p>
        <NuxtLink to="/search" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-full hover:scale-105 transition-transform inline-block uppercase tracking-wider shadow-lg shadow-rose-600/20">
          Temukan Lagu Favorit
        </NuxtLink>
      </div>

      <div v-else class="space-y-1">
        <div class="text-rose-400 text-[10px] font-black uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
          <Icon name="solar:heart-shine-bold" class="w-3.5 h-3.5" />
          <span>Koleksi Lagu Favorit Anda</span>
        </div>
        <SharedTrackList :tracks="likedTracks" />
      </div>
    </div>

    <!-- 3. VIEW KATEGORI: ARTIS DIKUTI (ARTISTS) -->
    <div v-else-if="activeLibTab === 'artists'">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div 
          v-for="(artist, index) in followedArtists" 
          :key="index"
          class="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <img :src="artist.image" class="w-12 h-12 rounded-full object-cover bg-zinc-800 border border-white/5 flex-shrink-0" alt="Artist Profile" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors">{{ artist.name }}</p>
            <p class="text-[10px] font-bold text-zinc-500 mt-0.5 uppercase tracking-wider">{{ artist.type }}</p>
          </div>
          <Icon name="solar:arrow-right-linear" class="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors mr-1" />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Sembunyikan scrollbar di menu kategori jika menu melebihi lebar layar HP */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>