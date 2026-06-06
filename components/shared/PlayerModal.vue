<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { usePlayerStore } from '~/stores/player'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  track: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
const player = usePlayerStore()

const activeTab = ref('lyrics') // 'lyrics' or 'artist'
const lyricsContainer = ref(null)
const lyrics = ref([])
const loadingLyrics = ref(false)
const noLyricsFound = ref(false)

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

// 🛠️ FUNGSI PARSING LYRICS FORMAT LRC KEDALAM ARRAY OBJEK
const parseLRC = (lrcText) => {
  if (!lrcText) return []
  const lines = lrcText.split('\n')
  const parsed = []

  lines.forEach(line => {
    // Regex untuk menangkap format timestamp [mm:ss.xx] atau [mm:ss]
    const match = line.match(/\[(\d+):(\d+)(?:\.(\d+))?\](.*)/)
    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0').substring(0, 3), 10) : 0
      
      // Hitung total waktu baris tersebut dalam hitungan detik (float)
      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000
      const text = match[4].trim()

      if (text) {
        parsed.push({ time: totalSeconds, text })
      }
    }
  })

  // Urutkan berdasarkan waktu agar sinkronisasi baris tidak lompat-lompat
  return parsed.sort((a, b) => a.time - b.time)
}

// 🌐 FETCH LIRIK SINKRON DARI BACKEND API KAMU (LRCLIB OVERVIEW)
const fetchSyncedLyrics = async () => {
  if (!props.track) return
  
  loadingLyrics.value = true
  noLyricsFound.value = false
  lyrics.value = []

  try {
    // Bersihkan judul lagu dari embel-embel Youtube (Official Video, Lirik, dll)
    const rawTitle = props.track.snippet?.title || ''
    const cleanTitle = rawTitle.replace(/\[[^\]]*\]|\([^)]*\)|official\s*video|lyric\s*video|lyrics|video/gi, '').trim()
    const artist = props.track.snippet?.channelTitle || ''

    // Tembak route backend kamu
    const data = await $fetch('/api/lyrics', {
      query: { 
        track_name: cleanTitle,
        artist_name: artist
      }
    })

    // Jika API lrclib mengembalikan format lirc resmi (syncedLyrics)
    if (data && data.syncedLyrics) {
      lyrics.value = parseLRC(data.syncedLyrics)
    } else if (data && data.plainLyrics) {
      // Fallback jika hanya tersedia lirik teks biasa tanpa detikan waktu
      lyrics.value = data.plainLyrics.split('\n').map((text, i) => ({ time: i * 4, text }))
    } else {
      noLyricsFound.value = true
    }
  } catch (err) {
    console.error('Gagal mengambil lirik dari LRCLIB:', err)
    noLyricsFound.value = true
  } finally {
    loadingLyrics.value = false
  }
}

// Deteksi lirik aktif yang sedang menyala secara real-time
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

// Trigger fetch lirik setiap kali trek musik berubah
watch(() => props.track?.id?.videoId, () => {
  fetchSyncedLyrics()
}, { immediate: true })

// Auto-scroll lirik otomatis ke tengah viewport container
watch(activeLyricIndex, async (newIndex) => {
  if (activeTab.value === 'lyrics' && lyricsContainer.value && newIndex !== -1) {
    await nextTick()
    const activeElement = lyricsContainer.value.children[newIndex + 1] // +1 antisipasi header status lirik
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})
</script>

<template>
  <transition name="slide-up">
    <div v-if="isOpen && track" class="fixed inset-0 z-[100] bg-zinc-950 flex flex-col md:flex-row overflow-hidden">
      
      <!-- Top Bar Mobile -->
      <div class="md:hidden absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button @click="emit('close')" class="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-transform">
          <Icon name="solar:alt-arrow-down-bold" class="w-6 h-6" />
        </button>
        <span class="text-xs font-bold tracking-widest text-zinc-300 uppercase">Now Playing</span>
        <button class="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md">
          <Icon name="solar:menu-dots-bold" class="w-6 h-6" />
        </button>
      </div>

      <!-- Left: Main Player Area -->
      <div class="flex-1 flex flex-col relative h-[55vh] md:h-full bg-gradient-to-b from-rose-950/40 to-zinc-950 p-6 md:p-12 justify-center">
        
        <!-- Desktop Close Button -->
        <button @click="emit('close')" class="hidden md:flex absolute top-8 left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors">
          <Icon name="solar:alt-arrow-down-bold" class="w-7 h-7" />
        </button>

        <div class="flex flex-col justify-center max-w-md mx-auto w-full mt-10 md:mt-0">
          <!-- Album Art High Resolution -->
          <div class="w-full aspect-square rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden mb-6 md:mb-10 bg-zinc-900 border border-white/5">
            <img 
              :src="track.snippet?.thumbnails?.high?.url || track.snippet?.thumbnails?.medium?.url" 
              class="w-full h-full object-cover"
              alt="Album Art"
            >
          </div>

          <!-- Song Info Details -->
          <div class="flex items-center justify-between mb-5 px-1">
            <div class="min-w-0 pr-4">
              <h2 class="text-xl md:text-3xl font-black text-white truncate mb-1.5 tracking-tight">{{ track.snippet?.title }}</h2>
              <p class="text-sm md:text-base text-zinc-400 font-semibold truncate">{{ track.snippet?.channelTitle }}</p>
            </div>
            <button class="text-zinc-500 hover:text-rose-500 transition-colors flex-shrink-0 active:scale-95">
              <Icon name="solar:heart-bold" class="w-7 h-7" />
            </button>
          </div>

          <!-- Timeline Slider Progress Bar -->
          <div class="mb-5 px-1">
            <div 
              class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden group cursor-pointer relative"
              @click="handleSeek"
            >
              <div 
                class="h-full bg-white group-hover:bg-rose-500 relative transition-all duration-100 ease-linear"
                :style="{ width: `${progressPercentage}%` }"
              >
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow scale-110"></div>
              </div>
            </div>
            <div class="flex items-center justify-between mt-2.5 text-[11px] text-zinc-400 font-semibold tracking-tight">
              <span>{{ formatTime(player.currentTime) }}</span>
              <span>{{ formatTime(player.duration) }}</span>
            </div>
          </div>

          <!-- Player Deck Controls (Mulus) -->
          <div class="flex items-center justify-between px-4 mt-2">
            <button class="text-zinc-500 hover:text-white transition-colors"><Icon name="solar:shuffle-bold" class="w-5 h-5 md:w-6 md:h-6" /></button>
            <button class="text-white hover:text-rose-400 transition-colors"><Icon name="solar:skip-previous-bold" class="w-8 h-8 md:w-10 md:h-10" /></button>
            <button 
              @click="player.togglePlay()"
              class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl"
            >
              <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-6 h-6 md:w-7 md:h-7" :class="{'ml-0.5': !player.isPlaying}" />
            </button>
            <button class="text-white hover:text-rose-400 transition-colors"><Icon name="solar:skip-next-bold" class="w-8 h-8 md:w-10 md:h-10" /></button>
            <button class="text-zinc-500 hover:text-white transition-colors"><Icon name="solar:repeat-bold" class="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <!-- Right Side: Real-Time Synced Lyrics & Details Area -->
      <div class="w-full md:w-[400px] lg:w-[480px] h-[45vh] md:h-full bg-zinc-900/40 backdrop-blur-lg border-t md:border-t-0 md:border-l border-white/5 flex flex-col">
        <!-- Tab Controller Header -->
        <div class="flex p-2 bg-zinc-950/40 border-b border-white/5">
          <button 
            @click="activeTab = 'lyrics'"
            class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
            :class="activeTab === 'lyrics' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'"
          >
            Lyrics
          </button>
          <button 
            @click="activeTab = 'artist'"
            class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
            :class="activeTab === 'artist' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'"
          >
            Artist Info
          </button>
        </div>

        <!-- Tab Content Viewport -->
        <div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          <!-- Tab 1: Lyrics Dynamic Engine -->
          <div v-if="activeTab === 'lyrics'" class="space-y-6 pb-24" ref="lyricsContainer">
            <!-- Loading State -->
            <div v-if="loadingLyrics" class="text-center py-12 text-zinc-500 text-sm animate-pulse flex items-center justify-center gap-2">
              <Icon name="solar:refresh-bold" class="animate-spin w-5 h-5 text-rose-500" />
              <span>Sinkronisasi lirik LRCLIB...</span>
            </div>

            <!-- Error / Empty State -->
            <div v-else-if="noLyricsFound || lyrics.length === 0" class="text-center py-12 text-zinc-500 text-sm space-y-2">
              <Icon name="solar:notes-close-bold" class="w-8 h-8 text-zinc-600 mx-auto" />
              <p>Lirik instrumen / tidak tersedia untuk trek ini.</p>
            </div>

            <!-- List Teks Lirik Interaktif Berjalan -->
            <template v-else>
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 rounded-md text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>Live Synced</span>
              </div>
              
              <div 
                v-for="(line, index) in lyrics" 
                :key="index"
                class="text-xl md:text-2xl font-extrabold leading-relaxed transition-all duration-500 cursor-pointer select-none origin-left"
                :class="{
                  'text-rose-400 opacity-100 scale-105 filter drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]': activeLyricIndex === index,
                  'text-zinc-400 opacity-30 blur-[0.5px] hover:opacity-80 hover:blur-none': activeLyricIndex !== index
                }"
                @click="player.seekTo(line.time)"
              >
                {{ line.text }}
              </div>
            </template>
          </div>

          <!-- Tab 2: Artist Static Info (Standar Spotify UI) -->
          <div v-else-if="activeTab === 'artist'" class="space-y-6 pb-12">
            <div class="relative w-full h-44 rounded-2xl overflow-hidden shadow-lg group">
              <img src="https://images.unsplash.com/photo-1516280440502-65f6c5240f8a?q=80&w=800" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Artist banner" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <p class="text-white font-black text-xl">{{ track.snippet?.channelTitle }}</p>
                <p class="text-zinc-400 text-xs mt-0.5">Verified Music Creator</p>
              </div>
            </div>
            
            <p class="text-zinc-400 text-xs leading-relaxed font-medium">
              Data musisi "{{ track.snippet?.channelTitle }}". Konten audio streaming ditarik otomatis via enkripsi ID YouTube player API dengan kecocokan database lagu murni Spotify global.
            </p>
            
            <button class="w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-colors bg-white/5">
              Lihat Profil Artis
            </button>
          </div>

        </div>
      </div>

    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 99px;
}
</style>