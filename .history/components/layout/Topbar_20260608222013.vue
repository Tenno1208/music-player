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

      <div class="flex items-center gap-6">
        
        <NuxtLink to="/" class="flex items-center gap-3 active:scale-98 transition-transform group">
          <div class="relative w-9 h-9 flex items-center justify-center">
            <div class="absolute -inset-1 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 blur-sm opacity-40 group-hover:opacity-75 transition-opacity"></div>
            
            <svg class="relative w-full h-full drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="url(#vinylGrad)" stroke="#222" stroke-width="1.5"/>
              <circle cx="50" cy="50" r="30" stroke="#1c1c1c" stroke-width="1" stroke-dasharray="2 2"/>
              <circle cx="50" cy="50" r="20" stroke="#1c1c1c" stroke-width="1"/>
              
              <circle cx="50" cy="42" r="5" fill="#e11d48"/>
              
              <path d="M28 25C28 25 32.5 45.5 44.5 61.5L45 27.5L62.5 29C62.5 29 61 63.5 61 73C53 72.5 39 49.5 29.5 34.5L29 70C24 67.5 28 25 28 25Z" fill="url(#redN)" drop-shadow="0 4px 10px rgba(0,0,0,0.5)"/>
              
              <defs>
                <radialGradient id="vinylGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(40)">
                  <stop offset="0" stop-color="#0d0d0d"/>
                  <stop offset="0.6" stop-color="#1f1f1f"/>
                  <stop offset="1" stop-color="#050505"/>
                </radialGradient>
                <linearGradient id="redN" x1="28" y1="25" x2="62.5" y2="73" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#f43f5e"/>
                  <stop offset="0.5" stop-color="#e11d48"/>
                  <stop offset="1" stop-color="#9f1239"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <span class="text-xl tracking-tight font-serif select-none text-zinc-100 font-bold hidden sm:block">
            Noi<span class="text-rose-500 font-sans italic font-black text-2xl tracking-tighter mr-[1px]">z</span>y
          </span>
        </NuxtLink>

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

    <div class="h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent opacity-80"></div>
  </header>
</template>