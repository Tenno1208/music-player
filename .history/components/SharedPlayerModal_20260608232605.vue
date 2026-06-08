<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-[#121212] flex flex-col md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] md:h-[88vh] md:rounded-3xl md:border md:border-white/10 md:shadow-2xl overflow-hidden text-zinc-100">
      
      <div class="relative z-10 flex items-center justify-between px-5 py-4">
        <button @click="emit('close')" class="p-2 -ml-2 text-zinc-300 hover:text-white active:scale-95 transition-transform">
          <Icon name="solar:alt-arrow-down-bold" class="w-6 h-6" />
        </button>
        <div class="flex items-center gap-4 text-zinc-300">
          <button class="p-2 hover:text-white"><Icon name="solar:cast-bold" class="w-5 h-5" /></button>
          <button class="p-2 -mr-2 hover:text-white"><Icon name="solar:menu-dots-bold" class="w-5 h-5" /></button>
        </div>
      </div>

      <div class="relative z-10 flex-1 flex flex-col px-6 justify-between overflow-hidden pb-4">
        
        <div v-if="activeTab === 'player'" class="flex-1 flex flex-col justify-center space-y-6 overflow-y-auto scrollbar-hide py-4">
          <div class="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-zinc-900">
            <img :src="track?.snippet?.thumbnails?.high?.url || track?.snippet?.thumbnails?.medium?.url" class="w-full h-full object-cover" alt="Cover Art" />
          </div>

          <div class="flex items-center justify-between gap-4 pt-2">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-black text-white truncate tracking-tight">{{ track?.snippet?.title }}</h2>
              <p class="text-rose-400 text-sm font-bold truncate mt-0.5 uppercase tracking-wide cursor-pointer hover:underline" @click="activeTab = 'artist'">
                {{ track?.snippet?.channelTitle }}
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:playlist-2-bold" class="w-6 h-6" /></button>
              <button 
                @click="player.toggleLike(track)" 
                class="transition-all duration-300 active:scale-75"
                :class="player.isLiked(track) ? 'text-rose-500 scale-105' : 'text-zinc-400 hover:text-white'"
              >
                <Icon :name="player.isLiked(track) ? 'solar:heart-bold' : 'solar:heart-linear'" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'lyrics'" class="flex-1 flex flex-col overflow-hidden py-4">
          <div class="mb-4 pb-2 border-b border-white/5 flex-shrink-0">
            <h4 class="text-white text-sm font-bold truncate tracking-tight">{{ track?.snippet?.title }}</h4>
            <p class="text-zinc-400 text-xs truncate mt-0.5">{{ track?.snippet?.channelTitle }}</p>
          </div>
          <div class="flex-1 overflow-y-auto pr-1 scrollbar-hide scroll-smooth flex flex-col justify-start">
            <div v-if="loadingLyrics" class="my-auto text-center text-zinc-500 text-sm animate-pulse flex items-center justify-center gap-2">
              <Icon name="solar:refresh-bold" class="animate-spin w-5 h-5 text-rose-500" />
              <span>Memuat Lirik...</span>
            </div>
            <div v-else-if="noLyricsFound" class="my-auto text-center text-zinc-500 text-sm">Lirik tidak tersedia.</div>
            <div v-else ref="lyricsContainer" class="space-y-6 py-20">
              <p v-for="(line, index) in lyrics" :key="index" @click="player.seekTo(line.time)"
                class="text-xl md:text-2xl font-black leading-relaxed transition-all duration-500 cursor-pointer select-none"
                :class="index === activeLyricIndex ? 'text-white' : 'text-white/20'">
                {{ line.text }}
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'artist'" class="flex-1 flex flex-col space-y-5 overflow-y-auto scrollbar-hide py-4">
          <div v-if="loadingArtist" class="text-center my-auto text-sm animate-pulse text-zinc-500">Mencari profil...</div>
          <template v-else-if="artistData">
            <div class="relative w-full h-40 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
              <img :src="artistData.image" class="w-full h-full object-cover" />
              <div class="absolute bottom-3 left-4 text-white font-black text-xl">{{ artistData.name }}</div>
            </div>
            <div class="space-y-2">
              <div v-for="(trackItem, idx) in artistData.topTracks" :key="idx" @click="handlePlayTrack(trackItem)"
                class="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-zinc-500 w-4">{{ idx + 1 }}</span>
                  <img :src="trackItem.albumCover" class="w-10 h-10 rounded-lg object-cover" />
                  <p class="text-sm font-bold text-white">{{ trackItem.title }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- CONTROLS & TIMELINE -->
        <div class="w-full space-y-5 pt-2 bg-[#121212]/50 backdrop-blur-sm flex-shrink-0">
          <div class="h-1 w-full bg-white/10 rounded-full cursor-pointer" @click="handleSeek">
            <div class="h-full bg-white rounded-full" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
          <div class="flex items-center justify-between px-2">
            <button @click="player.toggleShuffle()" :class="player.isShuffle ? 'text-rose-500' : 'text-zinc-400'">
              <Icon name="solar:shuffle-bold" class="w-5 h-5" />
            </button>
            <button @click="player.togglePlay()" class="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center">
              <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-7 h-7" />
            </button>
            <button @click="handleRedirectToArtistPage" class="text-zinc-400"><Icon name="solar:user-circle-bold-duotone" class="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { usePlayerStore } from '~/stores/player'

const props = defineProps({ isOpen: Boolean, track: Object })
const emit = defineEmits(['close'])
const player = usePlayerStore()
const activeTab = ref('player') 
const lyrics = ref([]), loadingLyrics = ref(false), noLyricsFound = ref(false)
const artistData = ref(null), loadingArtist = ref(false)

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const progressPercentage = computed(() => !player.duration ? 0 : (player.currentTime / player.duration) * 100)

const handleSeek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  player.seekTo((event.clientX - rect.left) / rect.width * player.duration)
}

const fetchSpotifyArtist = async () => {
  loadingArtist.value = true
  try {
    const res = await $fetch('/api/spotify', { query: { q: props.track.snippet?.channelTitle.replace(/video|official/gi, '').trim() } })
    artistData.value = res
  } catch (err) {
    artistData.value = null
  } finally {
    loadingArtist.value = false
  }
}

const handlePlayTrack = async (spotifyTrack) => {
    const searchData = await $fetch('/api/tracks', { query: { q: `${artistData.value.name} ${spotifyTrack.title}` } })
    if (searchData.items?.[0]) player.playTrack(searchData.items[0])
}

const handleRedirectToArtistPage = () => {
  if (!artistData.value?.id) return
  emit('close')
  navigateTo(`/artist/${artistData.value.id}?name=${encodeURIComponent(artistData.value.name)}`)
}

watch(() => props.track?.id?.videoId, () => {
  activeTab.value = 'player'
  fetchSpotifyArtist()
}, { immediate: true })
</script>