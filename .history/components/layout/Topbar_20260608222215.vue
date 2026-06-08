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
  <header class="sticky top-0 z-40 h-16 bg-[#121212]/80 backdrop-blur-2xl border-b border-white/5">
    <div class="h-full flex items-center justify-between px-4 md:px-6">

      <!-- Left: Logo Noizy & Navigasi -->
      <div class="flex items-center gap-6">
        
        <!-- Brand Group (Logo & Nama Web) -->
        <NuxtLink to="/" class="flex items-center gap-3 active:scale-98 transition-transform group">
          <!-- Logo Container dengan Efek Glow Merah -->
          <div class="relative w-9 h-9 flex items-center justify-center">
            <div class="absolute -inset-1 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 blur-sm opacity-40 group-hover:opacity-75 transition-opacity"></div>
            
            <!-- Membaca langsung dari folder public/logo.png -->
            <img 
              src="/logo.png" 
              class="relative w-full h-full object-contain drop-shadow-md" 
              alt="Noizy Logo"
            />
          </div>

          <!-- Nama Web: Noizy dengan 'z' khusus berwarna merah -->
          <span class="text-xl tracking-tight font-serif select-none text-zinc-100 font-bold hidden sm:block">
            Noi<span class="text-rose-500 font-sans italic font-black text-2xl tracking-tighter mr-[1px]">z</span>y
          </span>
        </NuxtLink>

        <!-- Tombol Panah Navigasi Sejarah (Hidden di Mobile) -->
        <div class="hidden md:flex gap-1.5 border-l border-white/10 pl-4">
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

      <!-- Center: Input Pencarian Dinamis -->
      <div
        v-if="route.path === '/search'"
        class="flex-1 max-w-xl mx-4"
      >
        <div class="relative group">
          <Icon
            name="solar:minimalistic-magnifer-bold-duotone"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 w-5 h-5 transition-colors"
          />

          <input
            v-model="searchStore.search"
            type="text"
            placeholder="Cari lagu, artis, atau album..."
            class="w-full h-10 rounded-full bg-zinc-900/90 border border-white/5 text-sm text-white pl-11 pr-10 outline-none focus:border-rose-500/40 focus:ring-4 focus:ring-rose-500/5 transition-all placeholder:text-zinc-500"
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

      <!-- Right: Notifikasi, Pengaturan & Profil Pengguna -->
      <div class="flex items-center gap-3">
        
        <div class="flex items-center gap-1.5">
          <button
            class="w-9 h-9 rounded-full bg-white/0 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative"
          >
            <Icon name="solar:bell-bing-bold-duotone" class="w-5 h-5" />
            <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>

          <button
            class="w-9 h-9 rounded-full bg-white/0 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <Icon name="solar:settings-bold-duotone" class="w-5 h-5" />
          </button>
        </div>

        <span class="h-5 w-px bg-white/10 hidden sm:block"></span>

        <!-- User Avatar Frame -->
        <div class="relative cursor-pointer group flex-shrink-0">
          <div class="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <img
            src="https://i.pravatar.cc/100?img=33"
            class="relative w-9 h-9 rounded-full border border-[#121212] object-cover"
            alt="User Avatar"
          >
        </div>

      </div>

    </div>

    <!-- Bottom Aesthetic Neon Accent Line -->
    <div class="h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent opacity-80"></div>
  </header>
</template>