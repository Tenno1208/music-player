<template>
  <div class="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-8">

    <!-- Quick Category Chips -->
    <div class="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        v-for="chip in quickFilters"
        :key="chip.label"
        @click="selectFilter(chip)"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border active:scale-95"
        :class="isActive(chip)
          ? 'bg-white text-black border-white shadow-sm'
          : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/[0.06]'"
      >
        {{ chip.label }}
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- DEFAULT STATE: BROWSE VIEW (query kosong)                -->
    <!-- ======================================================== -->
    <div v-if="!searchStore.search.trim()" class="space-y-10">

      <!-- Section 1: Genre Grid ala Spotify Browse -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">Jelajahi Berdasarkan Genre</h2>
          <span class="text-xs text-zinc-500 font-medium">Live dari Deezer</span>
        </div>

        <!-- Skeleton -->
        <div v-if="genresPending" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div v-for="i in 6" :key="i" class="aspect-[4/3] rounded-2xl bg-white/[0.04] animate-pulse"></div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div
            v-for="g in browseGenres"
            :key="g.id"
            @click="navigateTo(g.href)"
            class="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.03] shadow-lg"
            :style="{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }"
          >
            <!-- Cover miring di pojok kanan-bawah (khas Spotify Browse) -->
            <img
              v-if="g.image"
              :src="g.image"
              :alt="g.name"
              class="absolute -right-3 -bottom-4 w-[55%] aspect-square object-cover rounded-xl shadow-2xl rotate-[20deg] border border-white/20 group-hover:rotate-[10deg] transition-transform duration-500"
              loading="lazy"
            />
            <span
              v-else
              class="absolute -right-3 -bottom-4 w-[55%] aspect-square rounded-xl bg-black/30 rotate-[20deg] border border-white/20 flex items-center justify-center"
            >
              <Icon name="solar:music-notes-bold" class="w-7 h-7 text-white/60" />
            </span>

            <p class="absolute top-3 left-3 right-10 text-sm sm:text-base font-black text-white leading-tight drop-shadow">
              {{ g.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Section 2: Trending Picks (live, bukan hardcoded) -->
      <div v-if="trendingPicks.length" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">Pilihan Cepat Terhangat</h2>
          <span class="text-xs text-zinc-500 font-medium">Chart Deezer</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            v-for="(track, idx) in trendingPicks"
            :key="track.id"
            @click="playPicks(track)"
            class="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-mono text-zinc-500 w-4 text-center flex-shrink-0">{{ idx + 1 }}</span>
              <img
                :src="track.albumCover"
                class="w-12 h-12 rounded-xl object-cover bg-zinc-800 border border-white/10 flex-shrink-0"
                alt="Cover"
                loading="lazy"
              />
              <div class="min-w-0">
                <p class="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
                  {{ track.title }}
                </p>
                <p class="text-[11px] text-zinc-400 truncate mt-0.5 font-medium">
                  {{ track.artist }}
                </p>
              </div>
            </div>

            <div class="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white text-zinc-300 group-hover:text-black flex items-center justify-center transition-all flex-shrink-0 ml-2">
              <Icon name="solar:play-bold" class="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================== -->
    <!-- ACTIVE SEARCH RESULTS VIEW                               -->
    <!-- ======================================================== -->
    <div v-else class="space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div class="min-w-0">
          <h2 class="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            Hasil pencarian untuk <span class="text-rose-400 font-semibold">"{{ searchStore.search }}"</span>
          </h2>
          <p v-if="total > 0" class="text-[11px] text-zinc-500 mt-0.5">± {{ fmtNumber(total) }} lagu ditemukan</p>
        </div>
        <button @click="clearAll" class="text-xs text-zinc-500 hover:text-white transition-colors flex-shrink-0">
          Bersihkan
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && tracks.length === 0" class="space-y-2 py-4">
        <div v-for="i in 6" :key="i" class="h-14 bg-white/[0.02] border border-white/[0.04] rounded-xl animate-pulse"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center text-zinc-500 text-xs space-y-2">
        <p>Terjadi kendala saat memuat hasil pencarian. Silakan coba kembali.</p>
        <button @click="fetchTracks(false)" class="text-rose-400 hover:text-rose-300 font-bold">Coba Lagi</button>
      </div>

      <!-- Empty Results -->
      <div v-else-if="tracks.length === 0" class="py-16 text-center space-y-2">
        <Icon name="solar:minimalistic-magnifer-linear" class="w-10 h-10 text-zinc-600 mx-auto" />
        <p class="text-sm font-semibold text-zinc-400">Tidak ada lagu yang cocok</p>
        <p class="text-xs text-zinc-600">Coba gunakan kata kunci artis, judul lagu, atau album lainnya.</p>
      </div>

      <!-- Results -->
      <div v-else class="space-y-8">

        <!-- Artis terkait (baris horizontal) -->
        <div v-if="artists.length" class="space-y-3">
          <h3 class="text-sm font-bold text-zinc-400 uppercase tracking-wider">Artis</h3>
          <div class="flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              v-for="a in artists"
              :key="a.id"
              @click="goArtist(a)"
              class="flex-shrink-0 w-[120px] text-center cursor-pointer group"
            >
              <div class="relative w-full aspect-square rounded-full overflow-hidden border border-white/[0.08] mb-2 bg-zinc-900 group-hover:border-rose-500/40 transition-colors">
                <img :src="a.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <p class="text-xs font-semibold text-zinc-200 truncate group-hover:text-rose-400 transition-colors">{{ a.name }}</p>
              <p class="text-[10px] text-zinc-500 mt-0.5">{{ fmtNumber(a.fans) }} fans</p>
            </div>
          </div>
        </div>

        <!-- Lagu (baris ala Spotify) -->
        <div class="space-y-1">
          <div
            v-for="(track, i) in tracks"
            :key="`${track.id}-${i}`"
            @click="playTrackRow(track)"
            class="group flex items-center gap-3 sm:gap-4 p-2 rounded-xl cursor-pointer transition-colors"
            :class="currentId === track.id ? 'bg-rose-500/[0.08]' : 'hover:bg-white/[0.05]'"
          >
            <span
              class="w-6 text-center text-sm font-semibold tabular-nums flex-shrink-0"
              :class="currentId === track.id ? 'text-rose-400' : 'text-zinc-500'"
            >
              {{ i + 1 }}
            </span>

            <img :src="track.albumCover" class="w-11 h-11 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] flex-shrink-0" loading="lazy" />

            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold truncate" :class="currentId === track.id ? 'text-rose-400' : 'text-white'">{{ track.title }}</p>
              <p class="text-xs text-zinc-500 truncate">{{ track.artist }}</p>
            </div>

            <p class="hidden md:block text-xs text-zinc-500 truncate max-w-[180px]">{{ track.album }}</p>
            <span class="hidden sm:block text-xs text-zinc-500 tabular-nums">{{ fmtDuration(track.durationMs) }}</span>

            <button class="w-8 h-8 rounded-full bg-white text-black hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition flex-shrink-0">
              <Icon name="solar:play-bold" class="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="flex justify-center pt-2">
          <button
            @click="fetchTracks(true)"
            :disabled="loadingMore"
            class="px-6 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-zinc-200 hover:text-white transition-all disabled:opacity-50"
          >
            {{ loadingMore ? 'Memuat...' : 'Tampilkan Lebih Banyak' }}
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useSearchStore } from '~/stores/search'
import { usePlayerStore } from '~/stores/player'

const searchStore = useSearchStore()
const playerStore = usePlayerStore()
const route = useRoute()

/* ================= DATA LIVE (Deezer) ================= */
const { data: apiGenres, pending: genresPending } = await useFetch('/api/genres', { key: 'genres-browse' })
const { data: homeData } = await useFetch('/api/home', { key: 'home-catalog' })

const FALLBACK_GENRES = [
  { id: 'pop-indonesia', name: 'Pop Indonesia', colors: ['#fbbf24', '#92400e'], image: '', href: '/genre/pop-indonesia?name=Pop%20Indonesia' },
  { id: 'dangdut', name: 'Dangdut', colors: ['#facc15', '#854d0e'], image: '', href: '/genre/dangdut?name=Dangdut' },
  { id: '116', name: 'Hip-Hop', colors: ['#fb923c', '#7c2d12'], image: '', href: '/genre/116' },
  { id: '152', name: 'Rock', colors: ['#ef4444', '#27272a'], image: '', href: '/genre/152' },
  { id: '129', name: 'Jazz', colors: ['#38bdf8', '#1e3a8a'], image: '', href: '/genre/129' },
  { id: 'kpop', name: 'K-Pop', colors: ['#f472b6', '#9d174d'], image: '', href: '/genre/kpop?name=K-Pop' }
]

const browseGenres = computed(() =>
  apiGenres.value?.length ? apiGenres.value : FALLBACK_GENRES
)
const trendingPicks = computed(() => (homeData.value?.tracks || []).slice(0, 6))

/* ================= CHIPS FILTER ================= */
const quickFilters = [
  { label: 'Semua', query: 'hits indonesia' },
  { label: 'Pop Indonesia', query: 'pop indonesia' },
  { label: 'Indie Folk', query: 'indie folk indonesia' },
  { label: 'Akustik Santai', query: 'akustik santai' },
  { label: 'R&B / Soul', query: 'rnb soul indonesia' },
  { label: 'Lo-Fi & Study', query: 'lofi study beats' },
  { label: 'Rock Alternatif', query: 'rock alternatif indonesia' },
  { label: 'Nostalgia 2000an', query: 'lagu nostalgia indonesia 2000an' }
]

const activeFilter = ref('')

const selectFilter = (chip) => {
  activeFilter.value = chip.label
  searchStore.search = chip.query
}

const isActive = (chip) =>
  activeFilter.value === chip.label || searchStore.search === chip.query

/* ================= PENCARIAN (race-safe) ================= */
const LIMIT = 24

const tracks = ref([])
const artists = ref([])
const total = ref(0)
const index = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref(false)
const hasMore = computed(() => tracks.value.length > 0 && tracks.value.length < total.value)

// Proteksi ketikan:
// reqId    → token, hanya respons dengan token TERBARU yang boleh menempel
// controller → AbortController, request lama dibatalkan beneran (hemat + anti basi)
let reqId = 0
let controller = null
let debounceTimeout = null

const abortInflight = () => {
  if (controller) { controller.abort(); controller = null }
}

const resetResults = () => {
  tracks.value = []
  artists.value = []
  total.value = 0
  index.value = 0
  error.value = false
}

const fetchTracks = async (isLoadMore = false) => {
  const q = searchStore.search.trim()

  // (A) SEMUA huruf dihapus → bersihkan SEGERA + batalkan request lama
  if (!q) {
    reqId++
    abortInflight()
    loading.value = false
    loadingMore.value = false
    resetResults()
    activeFilter.value = ''
    return
  }

  // (B) Load more (tombol "Tampilkan Lebih Banyak")
  if (isLoadMore) {
    if (loadingMore.value || loading.value || !hasMore.value) return
    const myId = ++reqId
    loadingMore.value = true
    error.value = false
    try {
      const data = await $fetch('/api/search', { query: { q, index: index.value, limit: LIMIT } })
      if (myId !== reqId || data.q !== q) return // basi → buang
      tracks.value = [...tracks.value, ...(data.tracks || [])]
      index.value += data.tracks?.length || 0
    } catch (err) {
      if (myId !== reqId) return
      console.error('SEARCH ERROR:', err)
      error.value = true
    } finally {
      if (myId === reqId) loadingMore.value = false
    }
    return
  }

  // (C) Ketikan baru (huruf baru / diubah) → batalkan lama, fetch dengan token baru
  const myId = ++reqId
  abortInflight()
  loadingMore.value = false
  controller = new AbortController()
  loading.value = true
  error.value = false

  try {
    const data = await $fetch('/api/search', {
      query: { q, index: 0, limit: LIMIT },
      signal: controller.signal // request sebelumnya benar-benar di-cancel
    })

    // respons basi → buang (pengguna sudah mengetik/menghapus lagi)
    if (myId !== reqId || data.q !== q) return

    tracks.value = data.tracks || []
    artists.value = data.artists || []
    total.value = data.total || 0
    index.value = tracks.value.length
  } catch (err) {
    if (myId !== reqId) return // dibatalkan → BUKAN error, diamkan saja
    console.error('SEARCH ERROR:', err)
    error.value = true
  } finally {
    if (myId === reqId) loading.value = false
  }
}

// Ketik/hapus huruf → debounce 350ms.
// HAPUS SEMUA huruf → langsung bersih tanpa nunggu debounce.
watch(() => searchStore.search, (val) => {
  clearTimeout(debounceTimeout)
  if (!val.trim()) {
    fetchTracks(false) // q kosong → reset instan
    return
  }
  debounceTimeout = setTimeout(() => fetchTracks(false), 350)
})

// Sinkron dari URL: /search?q=dangdut
watch(() => route.query.q, (val) => {
  if (typeof val === 'string' && val && val !== searchStore.search) {
    searchStore.search = val
  }
}, { immediate: true })

onMounted(() => {
  // hindari fetch ganda: kalau query datang dari URL, watcher store yang menangani
  const fromUrl = typeof route.query.q === 'string' && route.query.q === searchStore.search.trim()
  if (searchStore.search.trim() && !fromUrl) fetchTracks(false)
})

onBeforeUnmount(() => {
  // bersih-bersih saat pindah halaman: hentikan debounce + batalkan request
  clearTimeout(debounceTimeout)
  reqId++
  abortInflight()
})

/* ================= PLAYER & NAVIGASI ================= */
const currentId = computed(() =>
  playerStore.currentTrack?.id ?? playerStore.current?.id ?? null
)

const playTrackRow = (track) => {
  playerStore.setQueue(tracks.value)
  playerStore.playTrack(track)
}

const playPicks = (track) => {
  playerStore.setQueue(trendingPicks.value)
  playerStore.playTrack(track)
}

const goArtist = (a) =>
  navigateTo(`/artist/${a.id}?name=${encodeURIComponent(a.name)}`)

const clearAll = () => {
  searchStore.clearSearch()
  activeFilter.value = ''
  resetResults()
}

/* ================= HELPER ================= */
const fmtDuration = (ms) => {
  const s = Math.round((ms || 0) / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
const fmtNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + ' JT'
  if (n >= 1e3) return Math.round(n / 1e3) + ' RB'
  return String(n || 0)
}
</script>