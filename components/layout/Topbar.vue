<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '~/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const goBack = () => router.back()
const goForward = () => router.forward()

// Keyboard shortcut (Ctrl+K / Cmd+K) to open search
const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    if (route.path !== '/search') {
      router.push('/search')
    }
    const input = document.getElementById('global-search-input')
    if (input) input.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const pageTitle = computed(() => {
  if (route.path === '/') return 'Beranda'
  if (route.path === '/search') return 'Jelajah'
  if (route.path === '/library') return 'Koleksi Saya'
  if (route.path.startsWith('/artist/')) return 'Profil Artis'
  if (route.path === '/developer') return 'Profil Developer'
  return 'Noizy'
})
</script>

<template>
  <header class="sticky top-0 z-30 h-16 bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.06] w-full px-4 md:px-8">
    <div class="h-full flex items-center justify-between gap-4">

      <!-- LEFT: Mobile Brand & Desktop Nav Buttons -->
      <div class="flex items-center gap-3">
        <!-- Mobile Brand (since sidebar is hidden on mobile) -->
        <NuxtLink to="/" class="flex md:hidden items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center p-1">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-bold text-white tracking-tight">Noizy</span>
        </NuxtLink>

        <!-- Desktop Navigation Arrows -->
        <div class="hidden md:flex items-center gap-1.5">
          <button
            @click="goBack"
            class="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition flex items-center justify-center border border-white/[0.04] active:scale-95"
            title="Kembali"
          >
            <Icon name="solar:alt-arrow-left-linear" class="w-4 h-4" />
          </button>
          <button
            @click="goForward"
            class="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition flex items-center justify-center border border-white/[0.04] active:scale-95"
            title="Maju"
          >
            <Icon name="solar:alt-arrow-right-linear" class="w-4 h-4" />
          </button>

          <!-- Current Page Title -->
          <span class="ml-3 text-xs font-semibold text-zinc-400 tracking-wide">
            {{ pageTitle }}
          </span>
        </div>
      </div>

      <!-- CENTER: Sleek Search Bar -->
      <div class="flex-1 max-w-md mx-auto">
        <!-- On search page: Real input -->
        <div v-if="route.path === '/search'" class="relative group">
          <Icon
            name="solar:minimalistic-magnifer-linear"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-rose-400 w-4 h-4 transition-colors pointer-events-none"
          />
          <input
            id="global-search-input"
            v-model="searchStore.search"
            type="text"
            placeholder="Cari lagu, artis, atau genre..."
            class="w-full h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] focus:border-rose-500/50 focus:bg-white/[0.07] text-xs text-white pl-10 pr-9 outline-none transition-all placeholder:text-zinc-500"
            autofocus
          />
          <button
            v-if="searchStore.search"
            @click="searchStore.clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
          >
            <Icon name="solar:close-circle-bold" class="w-4 h-4" />
          </button>
        </div>

        <!-- On other pages: Search Pill Trigger -->
        <NuxtLink
          v-else
          to="/search"
          class="hidden sm:flex items-center justify-between w-full h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] px-3.5 text-xs text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer group"
        >
          <div class="flex items-center gap-2.5">
            <Icon name="solar:minimalistic-magnifer-linear" class="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span class="font-normal">Cari lagu, artis, atau album...</span>
          </div>
          <kbd class="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-zinc-400 bg-white/[0.05] border border-white/[0.08]">
            Ctrl K
          </kbd>
        </NuxtLink>
      </div>

      <!-- RIGHT: Audio Quality & User Profile -->
      <div class="flex items-center gap-3">
        <!-- Audio Stream Quality Pill -->
        <div class="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-zinc-400 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Lossless 24-bit</span>
        </div>

        <!-- Quick Search Icon on Mobile -->
        <NuxtLink
          v-if="route.path !== '/search'"
          to="/search"
          class="sm:hidden w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <Icon name="solar:minimalistic-magnifer-linear" class="w-4 h-4" />
        </NuxtLink>

        <!-- Divider -->
        <span class="h-4 w-px bg-white/[0.08] hidden sm:block"></span>

        <!-- Profile Link -->
        <NuxtLink
          to="/developer"
          class="flex items-center gap-2 group cursor-pointer"
          title="Lihat Profil Developer"
        >
          <div class="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-rose-500/50 transition-colors">
            <img
              src="https://i.pravatar.cc/100?img=33"
              class="w-full h-full object-cover"
              alt="User Avatar"
            />
          </div>
        </NuxtLink>
      </div>

    </div>
  </header>
</template>
