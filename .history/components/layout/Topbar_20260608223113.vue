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
  <header class="sticky top-0 z-40 h-14 bg-[#121212]/90 backdrop-blur-xl border-b border-white/5 w-full overflow-hidden">
    <div class="h-full flex items-center justify-between px-4 md:px-6 gap-2">

      <!-- ================= LEFT: BRAND LOGO (DIKECILKAN) ================= -->
      <div class="flex items-center gap-4 flex-shrink-0">
        
        <!-- Brand Group -->
        <NuxtLink to="/" class="flex items-center gap-2 active:scale-95 transition-transform group">
          <!-- Logo Container Super Compact -->
          <div class="relative w-7 h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
            <!-- Efek Glow Diperhalus agar tidak menabrak konten bawah -->
            <div class="absolute -inset-0.5 rounded-lg bg-red-500 blur-[2px] opacity-20 group-hover:opacity-50 transition-opacity"></div>
            
            <!-- Logo dari folder public/logo.png -->
            <img 
              src="/logo.png" 
              class="relative w-full h-full object-contain select-none" 
              alt="Noizy Logo"
            />
          </div>

          <!-- Nama Web Diperkecil & Dibuat Sleek -->
          <span class="text-base md:text-lg tracking-tight font-serif select-none text-zinc-100 font-black block">
            Noi<span class="text-rose-500 font-sans italic font-black text-1xl md:text-2xl tracking-tighter mr-[1px]">z</span>y
          </span>
        </NuxtLink>

        <!-- Tombol Panah Navigasi Sejarah -->
        <div class="hidden md:flex items-center gap-1 border-l border-white/10 pl-3">
          <button
            @click="goBack"
            class="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition flex items-center justify-center"
          >
            <Icon name="solar:alt-arrow-left-bold" class="w-3.5 h-3.5" />
          </button>
          <button
            @click="goForward"
            class="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition flex items-center justify-center"
          >
            <Icon name="solar:alt-arrow-right-bold" class="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      <!-- ================= CENTER: SEARCH INPUT ================= -->
      <div
        v-if="route.path === '/search'"
        class="flex-1 max-w-md"
      >
        <div class="relative group">
          <Icon
            name="solar:minimalistic-magnifer-bold-duotone"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 w-4 h-4 transition-colors"
          />

          <input
            v-model="searchStore.search"
            type="text"
            placeholder="Cari lagu, artis..."
            class="w-full h-8 rounded-full bg-zinc-900/90 border border-white/5 text-xs text-white pl-9 pr-8 outline-none focus:border-rose-500/40 focus:ring-4 focus:ring-rose-500/5 transition-all placeholder:text-zinc-500"
          >

          <button
            v-if="searchStore.search"
            @click="searchStore.clearSearch"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-500 hover:text-white transition-colors"
          >
            <Icon name="solar:close-circle-bold" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- ================= RIGHT: MENU UTALITAS ================= -->
      <div class="flex items-center gap-2 flex-shrink-0">
        
        <div class="flex items-center gap-0.5">
          <button class="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative">
            <Icon name="solar:bell-bing-bold-duotone" class="w-4 h-4" />
            <span class="absolute top-2.5 right-2.5 w-1 h-1 bg-rose-500 rounded-full"></span>
          </button>

          <button class="w-8 h-8 rounded-full hover:bg-white/5 hidden sm:flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <Icon name="solar:settings-bold-duotone" class="w-4 h-4" />
          </button>
        </div>

        <span class="h-4 w-px bg-white/10 hidden sm:block"></span>

        <!-- User Avatar Frame -->
        <div class="relative cursor-pointer group flex-shrink-0">
          <div class="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 blur-[1px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
          <img
            src="https://i.pravatar.cc/100?img=33"
            class="relative w-7 h-7 rounded-full border border-[#121212] object-cover"
            alt="User Avatar"
          >
        </div>

      </div>

    </div>

    <!-- Garis Tipis Pemisah Neon -->
    <div class="h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent opacity-60"></div>
  </header>
</template>