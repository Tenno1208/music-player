<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '~/stores/player'

const route = useRoute()
const player = usePlayerStore()

const likedCount = computed(() => player.likedTracks?.length || 0)
const historyCount = computed(() => player.history?.length || 0)

const mainNavItems = [
  { name: 'Beranda', to: '/', icon: 'solar:home-smile-linear', activeIcon: 'solar:home-smile-bold' },
  { name: 'Jelajah & Cari', to: '/search', icon: 'solar:minimalistic-magnifer-linear', activeIcon: 'solar:minimalistic-magnifer-bold' },
  { name: 'Koleksi Saya', to: '/library', icon: 'solar:library-linear', activeIcon: 'solar:library-bold' }
]

const libraryShortcuts = [
  { name: 'Lagu Disukai', to: '/library?tab=liked', icon: 'solar:heart-linear', activeIcon: 'solar:heart-bold', badge: likedCount },
  { name: 'Riwayat Putar', to: '/library?tab=history', icon: 'solar:history-linear', activeIcon: 'solar:history-bold', badge: historyCount },
  { name: 'Artis Diikuti', to: '/library?tab=artists', icon: 'solar:users-group-rounded-linear', activeIcon: 'solar:users-group-rounded-bold' }
]

const curatedPlaylists = [
  { title: 'Top 50 Indonesia', desc: 'Tangga lagu terpopuler' },
  { title: 'Acoustic Serenade', desc: 'Akustik tenang & santai' },
  { title: 'Late Night Chill', desc: 'Teman malam kontemplatif' },
  { title: 'Indie Wave ID', desc: 'Karya independen terpilih' }
]
</script>

<template>
  <div>
    <!-- ======================================================== -->
    <!-- DESKTOP SIDEBAR (FIXED LEFT, WIDTH 256px) -->
    <!-- ======================================================== -->
    <aside class="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0c0c0e] border-r border-white/[0.06] z-40 select-none">
      
      <!-- Brand Logo & Header -->
      <div class="px-6 py-5 border-b border-white/[0.05]">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-zinc-900 border border-rose-500/30 flex items-center justify-center p-1.5 shadow-sm group-hover:border-rose-500/60 transition-colors">
            <img src="/logo.png" alt="Noizy" class="w-full h-full object-contain filter drop-shadow" />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="text-base font-bold text-white tracking-tight">Noizy</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase bg-white/[0.07] text-zinc-400 border border-white/[0.06]">Hi-Fi</span>
            </div>
            <span class="text-[11px] text-zinc-500 font-medium">Studio Experience</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation Scrollable Area -->
      <div class="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-none">
        
        <!-- Main Navigation Links -->
        <div class="space-y-1">
          <NuxtLink
            v-for="item in mainNavItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group"
            :class="route.path === item.to 
              ? 'bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 shadow-sm' 
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'"
          >
            <Icon 
              :name="route.path === item.to ? item.activeIcon : item.icon" 
              class="w-4 h-4 transition-transform group-hover:scale-110" 
              :class="route.path === item.to ? 'text-rose-400' : 'text-zinc-400 group-hover:text-zinc-200'"
            />
            <span>{{ item.name }}</span>
          </NuxtLink>
        </div>

        <!-- Section: Koleksi Pribadi -->
        <div class="space-y-1">
          <div class="px-3 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Koleksi Anda
          </div>
          <NuxtLink
            v-for="sub in libraryShortcuts"
            :key="sub.to"
            :to="sub.to"
            class="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all group"
            :class="route.fullPath === sub.to
              ? 'bg-white/[0.07] text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'"
          >
            <div class="flex items-center gap-3">
              <Icon 
                :name="route.fullPath === sub.to ? sub.activeIcon : sub.icon" 
                class="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" 
              />
              <span>{{ sub.name }}</span>
            </div>
            <span 
              v-if="sub.badge && sub.badge.value > 0" 
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-400 group-hover:text-white"
            >
              {{ sub.badge.value }}
            </span>
          </NuxtLink>
        </div>

        <!-- Section: Curated Playlists (Editorial Feel) -->
        <div class="space-y-1 pt-2 border-t border-white/[0.04]">
          <div class="px-3 pb-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Kurasi Pilihan
          </div>
          <div
            v-for="(pl, idx) in curatedPlaylists"
            :key="idx"
            class="px-3.5 py-2 rounded-xl text-left hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <p class="text-xs font-medium text-zinc-300 group-hover:text-rose-300 transition-colors truncate">
              {{ pl.title }}
            </p>
            <p class="text-[10px] text-zinc-500 truncate mt-0.5 font-normal">
              {{ pl.desc }}
            </p>
          </div>
        </div>

      </div>

      <!-- Sidebar Footer (Developer / Audio Engine Status) -->
      <div class="p-3 border-t border-white/[0.05] bg-[#09090b]/40">
        <NuxtLink
          to="/developer"
          class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all group"
        >
          <div class="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-white/10 flex-shrink-0">
            <img src="https://i.pravatar.cc/100?img=33" alt="Avatar" class="w-full h-full object-cover" />
            <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#0c0c0e]"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">Avvatar</span>
            </div>
            <p class="text-[10px] text-zinc-500 font-medium truncate">Lead Engineer</p>
          </div>
          <Icon name="solar:alt-arrow-right-linear" class="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
        </NuxtLink>
      </div>

    </aside>

    <!-- ======================================================== -->
    <!-- MOBILE BOTTOM NAVIGATION DOCK (FLOATING GLASS DOCK) -->
    <!-- ======================================================== -->
    <nav class="md:hidden fixed bottom-3 left-3 right-3 h-14 bg-[#111115]/95 backdrop-blur-2xl border border-white/10 rounded-2xl z-40 shadow-[0_16px_36px_rgba(0,0,0,0.8)] overflow-hidden">
      <div class="grid grid-cols-4 h-full items-center px-1">
        
        <!-- Home -->
        <NuxtLink
          to="/"
          class="flex flex-col items-center justify-center gap-1 py-1 text-zinc-400 transition-colors group"
          :class="route.path === '/' ? 'text-rose-400 font-semibold' : 'hover:text-zinc-200'"
        >
          <Icon 
            :name="route.path === '/' ? 'solar:home-smile-bold' : 'solar:home-smile-linear'" 
            class="w-5 h-5 transition-transform group-active:scale-90"
            :class="route.path === '/' ? 'text-rose-500' : ''"
          />
          <span class="text-[10px] font-medium tracking-tight">Beranda</span>
        </NuxtLink>

        <!-- Search -->
        <NuxtLink
          to="/search"
          class="flex flex-col items-center justify-center gap-1 py-1 text-zinc-400 transition-colors group"
          :class="route.path === '/search' ? 'text-rose-400 font-semibold' : 'hover:text-zinc-200'"
        >
          <Icon 
            :name="route.path === '/search' ? 'solar:minimalistic-magnifer-bold' : 'solar:minimalistic-magnifer-linear'" 
            class="w-5 h-5 transition-transform group-active:scale-90"
            :class="route.path === '/search' ? 'text-rose-500' : ''"
          />
          <span class="text-[10px] font-medium tracking-tight">Cari</span>
        </NuxtLink>

        <!-- Library -->
        <NuxtLink
          to="/library"
          class="flex flex-col items-center justify-center gap-1 py-1 text-zinc-400 transition-colors group"
          :class="route.path === '/library' ? 'text-rose-400 font-semibold' : 'hover:text-zinc-200'"
        >
          <Icon 
            :name="route.path === '/library' ? 'solar:library-bold' : 'solar:library-linear'" 
            class="w-5 h-5 transition-transform group-active:scale-90"
            :class="route.path === '/library' ? 'text-rose-500' : ''"
          />
          <span class="text-[10px] font-medium tracking-tight">Koleksi</span>
        </NuxtLink>

        <!-- Profile / Developer -->
        <NuxtLink
          to="/developer"
          class="flex flex-col items-center justify-center gap-1 py-1 text-zinc-400 transition-colors group"
          :class="route.path === '/developer' ? 'text-rose-400 font-semibold' : 'hover:text-zinc-200'"
        >
          <Icon 
            :name="route.path === '/developer' ? 'solar:user-circle-bold' : 'solar:user-circle-linear'" 
            class="w-5 h-5 transition-transform group-active:scale-90"
            :class="route.path === '/developer' ? 'text-rose-500' : ''"
          />
          <span class="text-[10px] font-medium tracking-tight">Profil</span>
        </NuxtLink>

      </div>
    </nav>
  </div>
</template>
