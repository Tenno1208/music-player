<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <!-- Container Utama -->
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-[#121212] flex flex-col md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] md:h-[88vh] md:rounded-3xl md:border md:border-white/10 md:shadow-2xl overflow-hidden text-zinc-100">
      
      <!-- Top Action Bar -->
      <div class="relative z-10 flex items-center justify-between px-5 py-4">
        <button @click="emit('close')" class="p-2 -ml-2 text-zinc-300 hover:text-white active:scale-95 transition-transform">
          <Icon name="solar:alt-arrow-down-bold" class="w-6 h-6" />
        </button>
        <div class="flex items-center gap-4 text-zinc-300">
          <button class="p-2 hover:text-white"><Icon name="solar:cast-bold" class="w-5 h-5" /></button>
          <button class="p-2 -mr-2 hover:text-white"><Icon name="solar:menu-dots-bold" class="w-5 h-5" /></button>
        </div>
      </div>

      <!-- AREA KONTEN UTAMA DENGAN KONDISI DINAMIS TAB -->
      <div class="relative z-10 flex-1 flex flex-col px-6 justify-between overflow-hidden pb-4">
        
        <!-- ================== TAB VIEW: DEFAULT (MUSIC PLAYER) ================== -->
        <div v-if="activeTab === 'player'" class="flex-1 flex flex-col justify-center space-y-6 overflow-y-auto scrollbar-hide py-4">
          <!-- Big Cover Art -->
          <div class="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-zinc-900">
            <img :src="track?.snippet?.thumbnails?.high?.url || track?.snippet?.thumbnails?.medium?.url" class="w-full h-full object-cover" alt="Cover Art" />
          </div>

          <!-- Info Detail Trek & Kontrol Suka -->
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

        <!-- ================== TAB VIEW: LIVE SYNCED LYRICS FULLSCREEN ================== -->
        <div v-else-if="activeTab === 'lyrics'" class="flex-1 flex flex-col overflow-hidden py-4">
          <div class="mb-4 pb-2 border-b border-white/5 flex-shrink-0">
            <h4 class="text-white text-sm font-bold truncate tracking-tight">{{ track?.snippet?.title }}</h4>
            <p class="text-zinc-400 text-xs truncate mt-0.5">{{ track?.snippet?.channelTitle }}</p>
          </div>

          <div class="flex-1 overflow-y-auto pr-1 scrollbar-hide scroll-smooth flex flex-col justify-start">
            <div v-if="loadingLyrics" class="my-auto text-center text-zinc-500 text-sm animate-pulse flex items-center justify-center gap-2">
              <Icon name="solar:refresh-bold" class="animate-spin w-5 h-5 text-rose-500" />
              <span>Memuat Lirik Sinkron...</span>
            </div>

            <div v-else-if="noLyricsFound || lyrics.length === 0" class="my-auto text-center text-zinc-500 text-sm space-y-2">
              <Icon name="solar:notes-close-bold" class="w-8 h-8 text-zinc-600 mx-auto" />
              <p>Lirik tidak tersedia untuk lagu ini.</p>
            </div>

            <div v-else ref="lyricsContainer" class="space-y-6 py-20">
              <p 
                v-for="(line, index) in lyrics" 
                :key="index"
                class="text-xl md:text-2xl font-black leading-relaxed transition-all duration-500 cursor-pointer origin-left select-none"
                :class="{ 
                  'text-white opacity-100 scale-102 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]': index === activeLyricIndex,
                  'text-white/20 opacity-30 blur-[0.5px] hover:blur-none hover:opacity-60': index !== activeLyricIndex 
                }"
                @click="player.seekTo(line.time)"
              >
                {{ line.text }}
              </p>
            </div>
          </div>
        </div>

        <!-- ================== TAB VIEW: REAL-TIME SPOTIFY ARTIST INFO & TRACKS ================== -->
        <div v-else-if="activeTab === 'artist'" class="flex-1 flex flex-col space-y-5 overflow-y-auto scrollbar-hide py-4">
          
          <div v-if="loadingArtist" class="text-center my-auto py-12 text-zinc-500 text-sm animate-pulse flex items-center justify-center gap-2">
            <Icon name="solar:refresh-bold" class="animate-spin w-5 h-5 text-rose-500" />
            <span>Mencari profil di Spotify...</span>
          </div>

          <template v-else-if="artistData">
            <div class="relative w-full h-40 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 group border border-white/5 flex-shrink-0">
              <img 
                :src="artistData.image" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Artist Image" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-transparent"></div>
              
              <div class="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-rose-400 flex items-center gap-1">
                <Icon name="solar:star-bold" class="w-3 h-3" />
                <span>Populer #{{ artistData.popularity }}</span>
              </div>

              <div class="absolute bottom-3 left-4 right-4 min-w-0">
                <p class="text-white font-black text-xl tracking-tight truncate drop-shadow-md">{{ artistData.name }}</p>
              </div>
            </div>

            <div class="space-y-3 flex-1">
              <div class="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 class="text-sm font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Icon name="solar:music-notes-bold" class="w-4 h-4 text-rose-500" />
                  Lagu Populer
                </h3>
                <span class="text-[10px] text-zinc-500">Spotify Data</span>
              </div>

              <div class="space-y-2">
                <div 
                  v-for="(trackItem, idx) in artistData.topTracks" 
                  :key="idx" 
                  class="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-xs font-bold text-zinc-500 w-4 text-center group-hover:text-rose-400 transition-colors">
                      {{ idx + 1 }}
                    </span>
                    <img :src="trackItem.albumCover" class="w-10 h-10 rounded-lg object-cover bg-zinc-800 border border-white/5 flex-shrink-0" alt="Cover" />
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors">{{ trackItem.title }}</p>
                      <p class="text-xs text-zinc-400 truncate mt-0.5">{{ artistData.name }}</p>
                    </div>
                  </div>
                  
                  <button class="p-2 rounded-full bg-zinc-800 text-zinc-400 opacity-60 group-hover:opacity-100 group-hover:bg-white group-hover:text-black transition-all">
                    <Icon name="solar:play-bold" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
            <p class="text-zinc-500 text-[10px] text-center leading-relaxed font-medium pt-2">
              Disinkronkan secara otomatis menggunakan pencarian pintar Spotify Web API.
            </p>
          </template>

          <div v-else class="text-center my-auto py-12 text-zinc-500 text-xs space-y-2">
            <Icon name="solar:user-block-bold" class="w-8 h-8 text-zinc-600 mx-auto" />
            <p>Gagal memuat daftar lagu artis ini.</p>
          </div>
        </div>

        <!-- ====================================================================== -->

        <!-- DECK DEPAN: CONTROLS & TIMELINE -->
        <div class="w-full space-y-5 pt-2 bg-[#121212]/50 backdrop-blur-sm flex-shrink-0">
          <div class="space-y-2">
            <div class="h-1 w-full bg-white/10 rounded-full overflow-hidden group cursor-pointer relative" @click="handleSeek">
              <div class="h-full bg-white rounded-full transition-all duration-100 ease-linear relative" :style="{ width: `${progressPercentage}%` }">
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow scale-110 transition-opacity"></div>
              </div>
            </div>
            <div class="flex justify-between text-[11px] text-zinc-400 font-bold tracking-tight px-0.5">
              <span>{{ formatTime(player.currentTime) }}</span>
              <span>{{ formatTime(player.duration) }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between px-2">
            <button 
              @click="player.toggleShuffle()" 
              class="transition-colors transition-transform active:scale-95"
              :class="player.isShuffle ? 'text-rose-500 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'text-zinc-400 hover:text-white'"
              title="Acak Musik"
            >
              <Icon name="solar:shuffle-bold" class="w-5 h-5" />
            </button>
            <button class="text-white hover:text-rose-400 transition-colors active:scale-90"><Icon name="solar:skip-previous-bold" class="w-7 h-7" /></button>
            <button @click="player.togglePlay()" class="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-95 transition-transform">
              <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-7 h-7" :class="{'ml-0.5': !player.isPlaying}" />
            </button>
            <button class="text-white hover:text-rose-400 transition-colors active:scale-90"><Icon name="solar:skip-next-bold" class="w-7 h-7" /></button>
            <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:repeat-bold" class="w-5 h-5" /></button>
          </div>

          <div class="grid grid-cols-3 bg-[#18181c] border border-white/5 rounded-2xl p-1.5 mt-2 shadow-inner">
            <button @click="activeTab = 'player'" class="flex flex-col items-center justify-center py-2 rounded-xl transition-all gap-1" :class="activeTab === 'player' ? 'text-white bg-white/5 font-bold' : 'text-zinc-500 text-xs'">
              <Icon name="solar:playlist-minimalistic-bold-duotone" class="w-5 h-5" :class="activeTab === 'player' ? 'text-rose-500' : ''" />
              <span class="text-[9px] uppercase tracking-wider">Up Next</span>
            </button>
            <button @click="activeTab = 'lyrics'" class="flex flex-col items-center justify-center py-2 rounded-xl transition-all gap-1" :class="activeTab === 'lyrics' ? 'text-white bg-white/5 font-bold' : 'text-zinc-500 text-xs'">
              <Icon name="solar:music-note-bold-duotone" class="w-5 h-5" :class="activeTab === 'lyrics' ? 'text-rose-500' : ''" />
              <span class="text-[9px] uppercase tracking-wider">Lyrics</span>
            </button>
            <button @click="handleRedirectToArtistPage" class="flex flex-col items-center justify-center py-2 rounded-xl transition-all gap-1 text-zinc-500 text-xs hover:text-white">
              <Icon name="solar:user-circle-bold-duotone" class="w-5 h-5" />
              <span class="text-[9px] uppercase tracking-wider">Lihat Artis</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { usePlayerStore } from '~/stores/player'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  track: { type: Object, default: null }
})

const emit = defineEmits(['close'])
const player = usePlayerStore()

const activeTab = ref('player') 
const lyricsContainer = ref(null)

const lyrics = ref([])
const loadingLyrics = ref(false)
const noLyricsFound = ref(false)

const artistData = ref(null)
const loadingArtist = ref(false)

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const progressPercentage = computed(() => {
  if (!player.duration) return 0
  return (player.currentTime / player.duration) * 100
})

const handleSeek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  player.seekTo(percentage * player.duration)
}

const fetchSpotifyArtist = async () => {
  if (!props.track) return

  loadingArtist.value = true
  artistData.value = null

  try {
    const rawArtistName = props.track.snippet?.channelTitle || ''
    const cleanArtistName = rawArtistName.replace(/video|official|topic|vevo|records|music/gi, '').trim()

    const res = await $fetch('/api/spotify', {
      query: { q: cleanArtistName }
    })

    if (!res) throw new Error('Artis tidak ditemukan')

    artistData.value = {
      id: res.id,
      name: res.name,
      image: res.image,
      popularity: res.popularity,
      topTracks: res.topTracks || []
    }
  } catch (err) {
    console.error(err)
    artistData.value = null
  } finally {aly {
    loadingArtist.value = false
  }
}

const handleRedirectToArtistPage = () => {
  if (!artistData.value?.id) {
    alert('Artist ID kosong')
    return
  }
  emit('close')
  navigateTo(`/artist/${artistData.value.id}?name=${encodeURIComponent(artistData.value.name)}`)
}

const parseLRC = (lrcText) => {
  if (!lrcText) return []
  const lines = lrcText.split('\n')
  const parsed = []

  lines.forEach(line => {
    const match = line.match(/\[(\d+):(\d+)(?:\.(\d+))?\](.*)/)
    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0').substring(0, 3), 10) : 0
      
      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000
      const text = match[4].trim()

      if (text) parsed.push({ time: totalSeconds, text })
    }
  })
  return parsed.sort((a, b) => a.time - b.time)
}

const fetchLyrics = async () => {
  if (!props.track) return
  
  loadingLyrics.value = true
  noLyricsFound.value = false
  lyrics.value = []

  try {
    const rawTitle = props.track.snippet?.title || ''
    const cleanTitle = rawTitle.replace(/\[[^\]]*\]|\([^)]*\)|official\s*video|lyric\s*video|lyrics|video/gi, '').trim()
    const artist = props.track.snippet?.channelTitle || ''

    const data = await $fetch('/api/lyrics', {
      query: { track_name: cleanTitle, artist_name: artist }
    })

    if (data && data.syncedLyrics) {
      lyrics.value = parseLRC(data.syncedLyrics)
    } else if (data && data.plainLyrics) {
      lyrics.value = data.plainLyrics.split('\n').map((text, i) => ({ time: i * 4, text }))
    } else {
      noLyricsFound.value = true
    }
  } catch (err) {
    console.error('LRCLIB Fetch Error:', err)
    noLyricsFound.value = true
  } finally {
    loadingLyrics.value = false
  }
}

const activeLyricIndex = computed(() => {
  let activeIndex = -1
  for (let i = 0; i < lyrics.value.length; i++) {
    if (player.currentTime >= lyrics.value[i].time) {
      activeIndex = i
    } else {
      break
    }
  }
  return activeIndex
})

watch(() => props.track?.id?.videoId, () => {
  activeTab.value = 'player' 
  fetchLyrics()
  fetchSpotifyArtist() 
}, { immediate: true })

watch(activeLyricIndex, async (newIndex) => {
  if (activeTab.value === 'lyrics' && lyricsContainer.value && newIndex !== -1) {
    await nextTick()
    const activeElement = lyricsContainer.value.children[newIndex + 1]
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>