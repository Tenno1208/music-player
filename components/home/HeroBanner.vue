<template>
  <div class="space-y-6">

    <!-- Greeting -->
    <div class="flex items-end justify-between pt-2">
      <div>
        <p class="text-xs font-semibold text-rose-400 tracking-wider uppercase mb-1">
          Kurasi Khusus
        </p>
        <h1 class="flex items-center gap-2.5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          <Icon :name="greetingIcon" class="w-6 h-6 sm:w-8 sm:h-8 text-amber-400/90" />
          {{ greetingTime }}
        </h1>
      </div>
      <div class="hidden sm:flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Studio Audio Engine Siap</span>
      </div>
    </div>

    <!-- Category Chips ala Spotify (live dari /api/genres) -->
<div class="flex gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
  <template v-if="genresPending">
    <div v-for="i in 8" :key="i" class="h-11 w-32 rounded-full bg-white/[0.05] animate-pulse flex-shrink-0" />
  </template>
  <template v-else>
    <NuxtLink
      v-for="cat in categories"
      :key="cat.id"
      :to="cat.href"
      class="group flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/30 flex-shrink-0 transition-all duration-300 hover:scale-[1.04] active:scale-95"
      :style="{ background: `linear-gradient(135deg, ${cat.colors[0]}, ${cat.colors[1]})` }"
    >
      <img v-if="cat.image" :src="cat.image" :alt="cat.name" class="w-8 h-8 rounded-full object-cover border border-white/15 shadow" loading="lazy" />
      <span v-else class="w-8 h-8 rounded-full bg-black/25 flex items-center justify-center">
        <Icon name="solar:music-notes-bold" class="w-4 h-4 text-white" />
      </span>
      <span class="text-xs font-bold text-white drop-shadow">{{ cat.name }}</span>
      <Icon name="solar:alt-arrow-right-linear" class="w-3.5 h-3.5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
    </NuxtLink>
  </template>
</div>

    <!-- Spotlight -->
    <div class="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 to-[#121216] border border-white/[0.08] shadow-2xl p-6 sm:p-10 flex flex-col justify-end min-h-[220px] sm:min-h-[280px] group">
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200"
          alt="Featured Cover"
          class="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700 filter brightness-75"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/70 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#0d0d11] via-transparent to-transparent"></div>
      </div>

      <div class="relative z-10 max-w-xl space-y-3">
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
          <Icon name="solar:stars-minimalistic-bold" class="w-3.5 h-3.5 text-rose-400" />
          <span>Sorotan Utama Minggu Ini</span>
        </div>

        <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Harmoni Indonesia: Gelombang Baru 2026
        </h2>

        <p class="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-lg font-normal leading-relaxed">
          Kumpulan karya terpilih dari musisi tanah air yang mendefinisikan lanskap musik modern dengan aransemen berkelas.
        </p>

        <div class="flex items-center gap-3 pt-2">
          <button
            @click="emit('playFeatured')"
            class="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg shadow-white/10"
          >
            <Icon name="solar:play-bold" class="w-4 h-4 ml-0.5" />
            <span>Putar Sekarang</span>
          </button>

          <NuxtLink
            to="/search"
            class="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white font-medium text-xs tracking-wide transition-colors"
          >
            Jelajahi Genre
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Quick Shortcuts -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">

      <div
        v-for="card in shortcuts"
        :key="card.title"
        @click="openShortcut(card)"
        class="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer group"
      >
        <!-- Cover + overlay + play mini -->
        <div class="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-lg"
             :class="card.gradient || 'bg-zinc-800'">
          <img v-if="card.img" :src="card.img" :alt="card.title" class="w-full h-full object-cover" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="solar:play-bold" class="w-3 h-3 text-white" />
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-white group-hover:text-rose-400 transition-colors truncate">{{ card.title }}</p>
          <p class="text-[10px] text-zinc-500 truncate mt-0.5 font-medium">{{ card.subtitle }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '~/stores/player'

const emit = defineEmits(['playFeatured'])
const player = usePlayerStore()

const greetingTime = computed(() => {
  const hour = new Date().getHours()
  if (hour < 4) return 'Selamat Beristirahat'
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const greetingIcon = computed(() => {
  const hour = new Date().getHours()
  if (hour < 4) return 'solar:moon-stars-bold'
  if (hour < 15) return 'solar:sun-2-bold'
  if (hour < 18) return 'solar:sun-3-bold'
  return 'solar:moon-stars-bold'
})

const { data: apiGenres, pending: genresPending } = useFetch('/api/genres', { default: () => [] })

// tampil saat API gagal/loading pertama
const FALLBACK_CATEGORIES = [
  { id: '132',           name: 'Pop',            colors: ['#fb7185', '#9f1239'], href: '/genre/132' },
  { id: '116',           name: 'Hip-Hop',        colors: ['#fb923c', '#7c2d12'], href: '/genre/116' },
  { id: '152',           name: 'Rock',           colors: ['#ef4444', '#27272a'], href: '/genre/152' },
  { id: '129',           name: 'Jazz',           colors: ['#38bdf8', '#1e3a8a'], href: '/genre/129' },
  { id: 'pop-indonesia', name: 'Pop Indonesia',  colors: ['#fbbf24', '#92400e'], href: '/genre/pop-indonesia?name=Pop%20Indonesia' },
  { id: 'dangdut',       name: 'Dangdut',        colors: ['#facc15', '#854d0e'], href: '/genre/dangdut?name=Dangdut' },
  { id: 'kpop',          name: 'K-Pop',          colors: ['#f472b6', '#9d174d'], href: '/genre/kpop?name=K-Pop' },
  { id: 'lofi-beats',    name: 'Lo-Fi',          colors: ['#94a3b8', '#1c1917'], href: '/genre/lofi-beats?name=Lo-Fi' }
]

const categories = computed(() =>
  apiGenres.value?.length ? apiGenres.value : FALLBACK_CATEGORIES
)

const openCategory = (cat) => {
  navigateTo({ path: '/search', query: { q: cat.query } })
}

// Shortcut cards — tinggal tambah data, tanpa copy-paste markup
const shortcuts = [
  { title: 'Hits Indonesia', subtitle: 'Tangga nada terpopuler', query: 'hits indonesia', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200' },
  { title: 'Akustik Teduh',  subtitle: 'Irama tenang & damai',   query: 'acoustic',        img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=200' },
  { title: 'Fokus & Rileks', subtitle: 'Konsentrasi tanpa henti', query: 'lofi',           img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200' },
  { title: 'Lagu Favorit',   subtitle: `${player.likedTracks?.length || 0} lagu tersimpan`, to: '/library?tab=liked' }
]

const openShortcut = (card) => {
  if (card.to) return navigateTo(card.to)
  navigateTo({ path: '/search', query: { q: card.query } })
}
</script>