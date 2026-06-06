<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '~/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const goBack = () => router.back()
const goForward = () => router.forward()
</script>

<template>
  <!-- Topbar dengan efek Glassmorphism Premium -->
  <div class="h-16 sm:h-20 bg-zinc-950/70 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 border-b border-white/5">
    
    <!-- Bagian Kiri: Tombol Navigasi (Sembunyi di Mobile demi ruang Search) -->
    <div class="hidden md:flex items-center gap-2">
      <button @click="goBack" class="w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
        <Icon name="solar:alt-arrow-left-bold" class="w-5 h-5" />
      </button>
      <button @click="goForward" class="w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
        <Icon name="solar:alt-arrow-right-bold" class="w-5 h-5" />
      </button>
    </div>

    <!-- Bagian Tengah: Input Pencarian Mewah & Sinkron -->
    <div v-if="route.path === '/search'" class="flex-1 md:max-w-md mx-2 md:mx-6">
      <div class="relative w-full group">
        <!-- Icon Magnifier dengan Animasi Glow -->
        <span class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-zinc-400 group-focus-within:text-rose-500 transition-colors duration-300">
          <Icon name="solar:minimalistic-magnifer-bold-duotone" class="w-5 h-5" />
        </span>
        
        <!-- Input Field -->
        <input
          v-model="searchStore.search"
          type="text"
          placeholder="Mau dengar lagu apa hari ini?"
          class="w-full bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 group-hover:border-white/10 focus:border-rose-500/40 text-white text-xs sm:text-sm rounded-xl sm:rounded-2xl pl-11 pr-10 py-2.5 sm:py-3 focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all duration-300 placeholder:text-zinc-500 font-medium shadow-inner"
        />

        <!-- Tombol Clear jika ada teks -->
        <button 
          v-if="searchStore.search" 
          @click="searchStore.clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
        >
          <Icon name="solar:close-circle-bold-duotone" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Bagian Kanan: Menu Actions & Profil -->
    <div class="flex items-center gap-3 sm:gap-4" :class="{ 'ml-auto': route.path !== '/search' }">
      <!-- Tombol Premium Premium Glow (Sembunyi di layar super kecil) -->
      <div class="hidden xs:inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg shadow-rose-600/10">
        <Icon name="solar:star-fall-bold" class="text-white w-3.5 h-3.5 animate-pulse" />
        <span class="text-[10px] sm:text-xs font-black tracking-wider text-white uppercase">Premium</span>
      </div>
      
      <!-- Notification Bell -->
      <button class="w-9 h-9 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative">
        <Icon name="solar:bell-bing-bold-duotone" class="w-5 h-5" />
        <!-- Notification Dot Indicator -->
        <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-zinc-950"></span>
      </button>
      
      <!-- Avatar User Mewah border neon tipis -->
      <div class="relative group cursor-pointer flex-shrink-0">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full opacity-30 group-hover:opacity-70 blur-[2px] transition duration-300"></div>
        <img 
          src="https://i.pravatar.cc/100?img=33" 
          alt="Profile" 
          class="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-black" 
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
@media (max-width: 480px) {
  .xs\:flex {
    display: none !important;
  }
}
</style>