<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-zinc-950 flex flex-col md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[450px] md:h-[88vh] md:rounded-3xl md:border md:border-white/10 md:shadow-2xl overflow-hidden">
      
      <div class="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-zinc-950 to-zinc-950 pointer-events-none z-0"></div>

      <div class="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/20 backdrop-blur-md">
        <button @click="emit('close')" class="p-2 -ml-2 text-zinc-400 hover:text-white active:scale-95 transition-transform">
          <Icon name="solar:alt-arrow-down-bold" class="w-6 h-6" />
        </button>
        <span class="text-xs font-bold tracking-widest text-zinc-400 uppercase text-center flex-1">Now Playing</span>
        <button class="p-2 -mr-2 text-zinc-400 hover:text-white">
          <Icon name="solar:menu-dots-bold" class="w-5 h-5" />
        </button>
      </div>

      <div class="relative z-10 flex-1 overflow-y-auto px-6 py-4 scrollbar-hide space-y-6">
        
        <div class="w-full aspect-square max-w-[280px] sm:max-w-[300px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5 bg-zinc-900 transition-transform duration-500" :class="{ 'scale-95 opacity-80': !player.isPlaying }">
          <img :src="track?.snippet?.thumbnails?.high?.url || track?.snippet?.thumbnails?.medium?.url" class="w-full h-full object-cover" alt="Cover Art" />
        </div>

        <div class="flex items-center justify-between gap-4 px-1">
          <div class="min-w-0 flex-1">
            <h2 class="text-xl font-black text-white truncate tracking-tight">{{ track?.snippet?.title }}</h2>
            <p class="text-zinc-400 text-sm font-medium truncate hover:text-rose-400 cursor-pointer mt-0.5 transition-colors" @click="goToArtist">
              {{ track?.snippet?.channelTitle }}
            </p>
          </div>
          
          <button 
            @click="goToArtist"
            class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-200 rounded-full border border-white/10 active:scale-95 transition-all"
          >
            <Icon name="solar:user-speak-bold" class="w-3.5 h-3.5 text-rose-500" />
            <span>Artis</span>
          </button>
        </div>

        <div class="space-y-2 px-1">
          <div class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden group cursor-pointer relative" @click="handleSeek">
            <div class="h-full bg-white rounded-full transition-all duration-100 ease-linear relative" :style="{ width: `${progressPercentage}%` }">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow scale-110 transition-opacity"></div>
            </div>
          </div>
          <div class="flex justify-between text-[11px] text-zinc-400 font-bold tracking-tight">
            <span>{{ formatTime(player.currentTime) }}</span>
            <span>{{ formatTime(player.duration) }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between px-6 py-2">
          <button class="text-zinc-500 hover:text-white transition-colors"><Icon name="solar:shuffle-bold" class="w-5 h-5" /></button>
          <button class="text-white hover:text-rose-400 transition-colors active:scale-90"><Icon name="solar:skip-previous-bold" class="w-8 h-8" /></button>
          
          <button @click="player.togglePlay()" class="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-95 transition-transform">
            <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-6 h-6" :class="{'ml-0.5': !player.isPlaying}" />
          </button>
          
          <button class="text-white hover:text-rose-400 transition-colors active:scale-90"><Icon name="solar:skip-next-bold" class="w-8 h-8" /></button>
          <button class="text-zinc-500 hover:text-white transition-colors"><Icon name="solar:repeat-bold" class="w-5 h-5" /></button>
        </div>

        <div class="bg-rose-950/30 border border-rose-500/10 rounded-2xl p-5 space-y-3 shadow-inner">
          <div class="flex items-center justify-between text-rose-400 text-[10px] font-bold tracking-widest uppercase">
            <div class="flex items-center gap-1.5">
              <Icon name="solar:notes-bold" class="w-4 h-4" />
              <span>Live Synced Lyrics</span>
            </div>
            <span v-if="lyrics.length > 0 && !loadingLyrics" class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>

          <div v-if="loadingLyrics" class="text-center py-8 text-rose-400/50 text-xs font-medium animate-pulse flex items-center justify-center gap-2">
            <Icon name="solar:refresh-bold" class="animate-spin w-4 h-4" />
            <span>Menyelaraskan lirik dari LRCLIB...</span>
          </div>

          <div v-else-if="noLyricsFound || lyrics.length === 0" class="text-center py-8 text-zinc-500 text-xs font-medium">
            <p>Lirik tidak tersedia atau berupa instrumen musik.</p>
          </div>

          <div 
            v-else 
            ref="lyricsContainer" 
            class="space-y-4 text-lg font-black leading-relaxed max-h-[160px] overflow-y-auto pr-1 scrollbar-hide scroll-smooth"
          >
            <p 
              v-for="(line, index) in lyrics" 
              :key="index"
              class="transition-all duration-500 cursor-pointer origin-left select-none"
              :class="{ 
                'text-rose-400 opacity-100 scale-102 filter drop-shadow-[0_0_6px_rgba(251,113,133,0.2)]': index === activeLyricIndex,
                'text-rose-100/20 opacity-40 blur-[0.5px] hover:blur-none hover:opacity-70': index !== activeLyricIndex 
              }"
              @click="player.seekTo(line.time)"
            >
              {{ line.text }}
            </p>
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

// 🛠️ PARSER DATA LRC MENJADI TIMESTAMPS DETIK
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

      if (text) {
        parsed.push({ time: totalSeconds, text })
      }
    }
  })
  return parsed.sort((a, b) => a.time - b.time)
}

// 🌐 FETCHING DATA ASLI DARI ENDPOINT LRCLIB VIA ROUTE BACKEND NUXT
const fetchLyrics = async () => {
  if (!props.track) return
  
  loadingLyrics.value = true
  noLyricsFound.value = false
  lyrics.value = []

  try {
    const rawTitle = props.track.snippet?.title || ''
    // Bersihkan judul lagu dari karakter kurung tambahan Youtube agar API tidak bingung
    const cleanTitle = rawTitle.replace(/\[[^\]]*\]|\([^)]*\)|official\s*video|lyric\s*video|lyrics|video/gi, '').trim()
    const artist = props.track.snippet?.channelTitle || ''

    const data = await $fetch('/api/lyrics', {
      query: { 
        track_name: cleanTitle,
        artist_name: artist
      }
    })

    if (data && data.syncedLyrics) {
      lyrics.value = parseLRC(data.syncedLyrics)
    } else if (data && data.plainLyrics) {
      // Fallback data teks lirik flat jika synced lirik kosong
      lyrics.value = data.plainLyrics.split('\n').map((text, i) => ({ time: i * 4, text }))
    } else {
      noLyricsFound.value = true
    }
  } catch (err) {
    console.error('Gagal memuat lirik asli dari LRCLIB:', err)
    noLyricsFound.value = true
  } finally {
    loadingLyrics.value = false
  }
}

// Menghitung indeks baris lirik aktif secara real-time
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

// Mengambil lirik baru setiap kali ID video lagu berganti
watch(() => props.track?.id?.videoId, () => {
  fetchLyrics()
}, { immediate: true })

// Auto-scroll lirik aktif ke posisi tengah box secara dinamis
watch(activeLyricIndex, async (newIndex) => {
  if (lyricsContainer.value && newIndex !== -1) {
    await nextTick()
    const activeElement = lyricsContainer.value.children[newIndex]
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})

const goToArtist = () => {
  if (props.track?.snippet?.channelTitle) {
    alert(`Mengarahkan ke halaman artis: ${props.track.snippet.channelTitle}`)
    emit('close')
  }
}
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