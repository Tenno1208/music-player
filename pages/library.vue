<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '~/stores/player'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()

const activeTab = ref('liked') // 'liked' | 'history' | 'artists'

// Sync with route query ?tab=
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && ['liked', 'history', 'artists'].includes(newTab)) {
      activeTab.value = newTab
    }
  },
  { immediate: true }
)

const setTab = (tab) => {
  activeTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

const likedTracks = computed(() => {
  return player.likedTracks || []
})

const historyTracks = computed(() => {
  return player.history || []
})

const followedArtists = ref([
  {
    id: '1dfeR4HaWDbWqFHLkxsg1d',
    name: 'Mahalini',
    image: 'https://i.scdn.co/image/ab6761610000e5ebd3564043a332daaa882853d6',
    type: 'Artis Terverifikasi'
  },
  {
    id: '4F4pp8NUW08BsX2VZODkAc',
    name: 'Hindia',
    image: 'https://i.scdn.co/image/ab6761610000e5ebb786cb6de7505caff17fe11f',
    type: 'Artis Terverifikasi'
  },
  {
    id: '77tT1b06qScNY8V5umUVUr',
    name: 'Rex Orange County',
    image: 'https://i.scdn.co/image/ab6761610000e5eb901ccc452604c427ef5f202f',
    type: 'Artis Terverifikasi'
  }
])

const playAllLiked = () => {
  if (likedTracks.value.length > 0) {
    player.setQueue(likedTracks.value)
    player.playTrack(likedTracks.value[0])
  }
}

const playAllHistory = () => {
  if (historyTracks.value.length > 0) {
    player.setQueue(historyTracks.value)
    player.playTrack(historyTracks.value[0])
  }
}
</script>

<template>
  <div class="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-8 select-none">
    
    <!-- Library Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-zinc-900 border border-rose-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Icon name="solar:library-bold" class="w-7 h-7 text-rose-500" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Koleksi Saya</h1>
          <p class="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
            Arsip pribadi musik favorit dan riwayat dengar Anda
          </p>
        </div>
      </div>

      <!-- Quick Action: Play Liked -->
      <div v-if="activeTab === 'liked' && likedTracks.length > 0">
        <button
          @click="playAllLiked"
          class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg"
        >
          <Icon name="solar:play-bold" class="w-4 h-4 ml-0.5" />
          <span>Putar Semua Lagu</span>
        </button>
      </div>
      <div v-else-if="activeTab === 'history' && historyTracks.length > 0">
        <button
          @click="playAllHistory"
          class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg"
        >
          <Icon name="solar:play-bold" class="w-4 h-4 ml-0.5" />
          <span>Putar Ulang Riwayat</span>
        </button>
      </div>
    </div>

    <!-- Segmented Navigation Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-white/[0.06] pb-3">
      <!-- Liked Tab -->
      <button
        @click="setTab('liked')"
        class="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border"
        :class="activeTab === 'liked'
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm'
          : 'bg-white/[0.03] text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.06]'"
      >
        <Icon name="solar:heart-bold" class="w-4 h-4" />
        <span>Lagu Disukai</span>
        <span
          v-if="likedTracks.length > 0"
          class="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
          :class="activeTab === 'liked' ? 'bg-rose-500 text-white' : 'bg-white/10 text-zinc-300'"
        >
          {{ likedTracks.length }}
        </span>
      </button>

      <!-- History Tab -->
      <button
        @click="setTab('history')"
        class="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border"
        :class="activeTab === 'history'
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm'
          : 'bg-white/[0.03] text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.06]'"
      >
        <Icon name="solar:history-bold" class="w-4 h-4" />
        <span>Riwayat Putar</span>
        <span
          v-if="historyTracks.length > 0"
          class="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
          :class="activeTab === 'history' ? 'bg-rose-500 text-white' : 'bg-white/10 text-zinc-300'"
        >
          {{ historyTracks.length }}
        </span>
      </button>

      <!-- Artists Tab -->
      <button
        @click="setTab('artists')"
        class="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border"
        :class="activeTab === 'artists'
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm'
          : 'bg-white/[0.03] text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.06]'"
      >
        <Icon name="solar:users-group-rounded-bold" class="w-4 h-4" />
        <span>Artis Diikuti</span>
      </button>
    </div>

    <!-- ================= TAB 1: LIKED SONGS ================= -->
    <div v-if="activeTab === 'liked'">
      <div v-if="likedTracks.length === 0" class="py-16 text-center space-y-3 bg-white/[0.01] rounded-3xl border border-white/[0.05] p-8">
        <div class="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto text-zinc-500">
          <Icon name="solar:heart-linear" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-white">Belum Ada Lagu Favorit</h3>
        <p class="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
          Sentuh ikon hati pada lagu manapun yang Anda nikmati untuk menyimpannya di koleksi pribadi ini.
        </p>
        <NuxtLink
          to="/search"
          class="inline-block mt-2 px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
        >
          Temukan Musik Baru
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <SharedTrackList :tracks="likedTracks" />
      </div>
    </div>

    <!-- ================= TAB 2: HISTORY ================= -->
    <div v-else-if="activeTab === 'history'">
      <div v-if="historyTracks.length === 0" class="py-16 text-center space-y-3 bg-white/[0.01] rounded-3xl border border-white/[0.05] p-8">
        <div class="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto text-zinc-500">
          <Icon name="solar:history-linear" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-white">Riwayat Masih Bersih</h3>
        <p class="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
          Semua musik yang Anda dengarkan di Noizy akan otomatis tersusun rapi di sini.
        </p>
        <NuxtLink
          to="/"
          class="inline-block mt-2 px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
        >
          Kembali ke Beranda
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <SharedTrackList :tracks="historyTracks" />
      </div>
    </div>

    <!-- ================= TAB 3: ARTISTS ================= -->
    <div v-else-if="activeTab === 'artists'" class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="artist in followedArtists"
          :key="artist.name"
          @click="navigateTo(`/artist/${artist.id}?name=${encodeURIComponent(artist.name)}`)"
          class="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.1] text-center cursor-pointer transition-all duration-300 group"
        >
          <div class="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-zinc-800 border border-white/10 shadow-md">
            <img :src="artist.image" :alt="artist.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <h4 class="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
            {{ artist.name }}
          </h4>
          <p class="text-[10px] text-zinc-500 truncate mt-0.5 font-medium">
            {{ artist.type }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
