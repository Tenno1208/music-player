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
  <header class="sticky top-0 z-40 h-16 bg-[#121212]/85 backdrop-blur-3xl border-b border-white/5 w-full">
    <div class="h-full flex items-center justify-between px-4 md:px-6 gap-2 md:gap-4">

      <!-- ================= LEFT: LOGO BRAND & NAVIGASI ================= -->
      <div class="flex items-center gap-3 md:gap-6 flex-shrink-0">
        
        <!-- Brand Group (Logo & Nama Web) -->
        <NuxtLink to="/" class="flex items-center gap-2.5 active:scale-95 transition-transform group">
          <!-- Logo Container dengan Efek Glow Merah -->
          <div class="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
            <div class="absolute -inset-1 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 blur-sm opacity-40 group-hover:opacity-75 transition-opacity"></div>
            
            <!-- Membaca file dari folder public/logo.png -->
            <img 
              src="/logo.png" 
              class="relative w-full h-full object-contain drop-shadow-md select-none" 
              alt="Noizy Logo"
            />
          </div>

          <!-- Nama Web: Tetap Terbaca Bagus & Lebar -->
          <span class="text-xl md:text-2xl tracking-tight font-serif select-none text-zinc-100 font-black block">
            Noi<span class="text-rose-500 font-sans italic font-black text-2xl md:text-3xl tracking-tighter mr-[1px]">z</span>y
          </span>
        </NuxtLink>

        <!-- Tombol Panah Navigasi Sejarah (Disembunyikan total di mobile untuk menghemat ruang) -->
        <div class="hidden md:flex items-center gap-1.5 border-l border-white/10 pl-4">
          <button
            @click="goBack"
            class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition flex items-center justify-center"
            title="Kembali"
          >
            <Icon name="solar:alt-arrow-left-bold" class="w-4 h-4" />
          </button>
          <button
            @click="goForward"
            class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition flex items-center justify-center"
            title="Maju"
          >
            <Icon name="solar:alt-arrow-right-bold" class="w-4 h-4" />
          </button>
        </div>

      </div>

      <!-- ================= CENTER: SEARCH INPUT DINAMIS ================= -->
      <div
        v-if="route.path === '/search'"
        class="flex-1 max-w-lg md:mx-4"
      >
        <div class="relative group">
          <Icon
            name="solar:minimalistic-magnifer-bold-duotone"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 w-4 h-4 md:w-5 md:h-5 transition-colors"
          />

          <input
            v-model="searchStore.search"
            type="text"
            placeholder="Cari lagu, artis..."
            class="w-full h-10 rounded-full bg-zinc-900/90 border border-white/5 text-xs md:text-sm text-white pl-10 pr-9 outline-none focus:border-rose-500/40 focus:ring-4 focus:ring-rose-500/5 transition-all placeholder:text-zinc-500"
          >

          <button
            v-if="searchStore.search"
            @click="searchStore.clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors"
          >
            <Icon name="solar:close-circle-bold" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- ================= RIGHT: AKSES MENU & PROFIL ================= -->
      <div class="flex items-center gap-2 md:gap-3 flex-shrink-0">
        
        <!-- Tombol Notifikasi & Settings -->
        <div class="flex items-center gap-1">
          <button
            class="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative"
            title="Notifikasi"
          >
            <Icon name="solar:bell-bing-bold-duotone" class="w-5 h-5" />
            <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>

          <!-- Di mobile disembunyikan agar hemat tempat, fokus ke Avatar profil -->
          <button
            class="w-9 h-9 rounded-full hover:bg-white/5 hidden sm:flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            title="Pengaturan"
          >
            <Icon name="solar:settings-bold-duotone" class="w-5 h-5" />
          </button>
        </div>

        <span class="h-5 w-px bg-white/10 hidden sm:block"></span>

        <!-- User Avatar Frame -->
        <div class="relative cursor-pointer group flex-shrink-0 ml-1">
          <div class="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <img
            src="https://i.pravatar.cc/100?img=33"
            class="relative w-8 h-8 md:w-9 md:h-9 rounded-full border border-[#121212] object-cover"
            alt="User Avatar"
          >
        </div>

      </div>

    </div>

    <!-- Bottom Aesthetic Neon Accent Line -->
    <div class="h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent opacity-80"></div>
  </header>
</template>