<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-[#0d0d11] md:bg-black/70 md:backdrop-blur-xl flex items-center justify-center text-zinc-100 select-none"
    >
      <!-- Modal Inner Container -->
      <div
        class="w-full h-full md:w-[480px] md:h-[88vh] md:max-h-[820px] md:rounded-3xl bg-[#111116] md:border md:border-white/10 flex flex-col overflow-hidden shadow-2xl relative"
      >
        <!-- Ambient Background Glow from Cover -->
        <div class="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-rose-500/10 blur-[100px] pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-zinc-800/40 blur-[100px] pointer-events-none"></div>

        <!-- ================= TOP BAR ================= -->
        <div class="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          <!-- Close / Dismiss Arrow -->
          <button
            @click="emit('close')"
            class="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition flex items-center justify-center active:scale-95"
            title="Tutup"
          >
            <Icon name="solar:alt-arrow-down-linear" class="w-4 h-4" />
          </button>

          <!-- Segmented Tab Switcher -->
          <div class="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
            <button
              @click="activeTab = 'player'"
              class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              :class="activeTab === 'player' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'"
            >
              Lagu
            </button>
            <button
              @click="activeTab = 'lyrics'"
              class="px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
              :class="activeTab === 'lyrics' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'"
            >
              <span>Lirik</span>
              <span v-if="lyrics.length > 0" class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>
            <button
              @click="activeTab = 'artist'"
              class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              :class="activeTab === 'artist' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'"
            >
              Artis
            </button>
          </div>

          <!-- Favorite Button in Header -->
          <button
            @click="player.toggleLike(track)"
            class="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition flex items-center justify-center active:scale-95"
          >
            <Icon
              :name="player.isLiked(track) ? 'solar:heart-bold' : 'solar:heart-linear'"
              class="w-4 h-4"
              :class="player.isLiked(track) ? 'text-rose-500' : ''"
            />
          </button>
        </div>

        <!-- ================= BODY CONTENT ================= -->
        <div class="relative z-10 flex-1 flex flex-col overflow-hidden px-6 pt-4 pb-2">
          
          <!-- TAB 1: PLAYER / NOW PLAYING COVER VIEW -->
          <div v-if="activeTab === 'player'" class="flex-1 flex flex-col justify-center space-y-6 overflow-y-auto scrollbar-none py-2">
            <!-- Large Artwork -->
            <div class="w-full aspect-square max-w-[320px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 group">
              <img
                :src="track?.snippet?.thumbnails?.high?.url || track?.snippet?.thumbnails?.medium?.url"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Cover Art"
              />
            </div>

            <!-- Track Info -->
            <div class="text-left space-y-1">
              <h2 class="text-xl md:text-2xl font-bold text-white tracking-tight line-clamp-2">
                {{ track?.snippet?.title }}
              </h2>
              <p
                class="text-sm font-medium text-rose-400 hover:underline cursor-pointer inline-block"
                @click="activeTab = 'artist'"
              >
                {{ track?.snippet?.channelTitle }}
              </p>
            </div>
          </div>

          <!-- TAB 2: SYNCHRONIZED LYRICS VIEW (APPLE MUSIC STYLE) -->
          <div v-else-if="activeTab === 'lyrics'" class="flex-1 flex flex-col overflow-hidden py-2">
            <!-- Lyrics Header -->
            <div class="flex items-center justify-between pb-3 border-b border-white/[0.06] flex-shrink-0">
              <div class="min-w-0">
                <p class="text-xs font-semibold text-white truncate">{{ track?.snippet?.title }}</p>
                <p class="text-[11px] text-zinc-500 truncate">{{ track?.snippet?.channelTitle }}</p>
              </div>
              <span class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                Sync Lirik
              </span>
            </div>

            <!-- Lyrics Scrollable Area -->
            <div class="flex-1 overflow-y-auto scrollbar-none scroll-smooth relative pr-1">
              <!-- Loading State -->
              <div v-if="loadingLyrics" class="h-full flex flex-col items-center justify-center text-zinc-500 text-xs gap-3">
                <Icon name="solar:refresh-linear" class="w-6 h-6 animate-spin text-rose-500" />
                <span>Menyelaraskan lirik dengan lagu...</span>
              </div>

              <!-- Empty State -->
              <div v-else-if="noLyricsFound || lyrics.length === 0" class="h-full flex flex-col items-center justify-center text-zinc-500 text-xs gap-2 text-center p-6">
                <Icon name="solar:notes-minimalistic-linear" class="w-8 h-8 text-zinc-600" />
                <p class="font-medium text-zinc-400">Lirik tidak tersedia untuk lagu ini</p>
                <p class="text-[11px] text-zinc-600 max-w-xs">Database lirik internasional belum memiliki rekaman sinkron untuk judul ini.</p>
              </div>

              <!-- Synced Lyrics Content -->
              <div v-else ref="lyricsContainer" class="py-24 space-y-8 text-left">
                <p
                  v-for="(line, index) in lyrics"
                  :key="index"
                  class="transition-all duration-300 cursor-pointer origin-left select-none leading-relaxed"
                  :class="{
                    'text-white font-bold text-2xl md:text-3xl filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]': index === activeLyricIndex,
                    'text-zinc-500/60 font-medium text-lg md:text-xl blur-[0.4px] hover:blur-none hover:text-zinc-300': index !== activeLyricIndex
                  }"
                  @click="player.seekTo(line.time)"
                >
                  {{ line.text }}
                </p>
              </div>
            </div>
          </div>

          <!-- TAB 3: SPOTIFY ARTIST PROFILE -->
          <div v-else-if="activeTab === 'artist'" class="flex-1 flex flex-col space-y-4 overflow-y-auto scrollbar-none py-2">
            <!-- Loading -->
            <div v-if="loadingArtist" class="h-full flex flex-col items-center justify-center text-zinc-500 text-xs gap-3">
              <Icon name="solar:refresh-linear" class="w-6 h-6 animate-spin text-rose-500" />
              <span>Memuat profil Spotify...</span>
            </div>

            <!-- Artist Loaded -->
            <template v-else-if="artistData">
              <div class="relative w-full h-44 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0 group">
                <img
                  :src="artistData.image"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Artist Photo"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#111116] via-black/40 to-transparent"></div>
                <div class="absolute bottom-3 left-4 right-4">
                  <div class="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
                    <Icon name="solar:verified-check-bold" class="w-4 h-4" />
                    <span>Terverifikasi</span>
                  </div>
                  <h3 class="text-xl font-bold text-white tracking-tight truncate">{{ artistData.name }}</h3>
                </div>
              </div>

              <!-- Top Tracks from Artist -->
              <div class="space-y-2 flex-1">
                <div class="flex items-center justify-between pb-1 border-b border-white/[0.05]">
                  <span class="text-xs font-semibold text-zinc-300">Lagu Terpopuler</span>
                  <button
                    @click="handleRedirectToArtistPage"
                    class="text-[11px] font-medium text-rose-400 hover:underline"
                  >
                    Buka Halaman Artis →
                  </button>
                </div>

                <div class="space-y-1">
                  <div
                    v-for="(item, idx) in artistData.topTracks?.slice(0, 5)"
                    :key="idx"
                    class="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer group"
                    @click="handlePlayArtistTrack(item)"
                  >
                    <span class="text-xs font-mono text-zinc-500 w-4 text-center">{{ idx + 1 }}</span>
                    <img :src="item.albumCover" class="w-9 h-9 rounded-lg object-cover bg-zinc-800 flex-shrink-0" alt="Cover" />
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-medium text-white truncate group-hover:text-rose-400 transition-colors">{{ item.title }}</p>
                      <p class="text-[10px] text-zinc-500 truncate mt-0.5">{{ artistData.name }}</p>
                    </div>
                    <Icon name="solar:play-linear" class="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </template>

            <!-- Error fallback -->
            <div v-else class="h-full flex flex-col items-center justify-center text-zinc-500 text-xs gap-2 text-center p-6">
              <Icon name="solar:user-cross-linear" class="w-8 h-8 text-zinc-600" />
              <p class="font-medium text-zinc-400">Profil artis tidak ditemukan</p>
            </div>
          </div>

        </div>

        <!-- ================= BOTTOM CONTROLS & SCRUBBER ================= -->
        <div class="relative z-10 px-6 py-4 bg-[#0d0d12]/90 backdrop-blur-md border-t border-white/[0.06] flex-shrink-0 space-y-3">
          <!-- Scrubber Bar -->
          <div class="space-y-1.5">
            <div
              class="h-1 hover:h-2 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer relative transition-all"
              @click="handleSeek"
            >
              <div
                class="h-full bg-white group-hover:bg-rose-500 transition-all duration-100 ease-linear rounded-full"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{{ formatTime(player.currentTime) }}</span>
              <span>{{ formatTime(player.duration) }}</span>
            </div>
          </div>

          <!-- Playback Action Buttons -->
          <div class="flex items-center justify-between px-2 pt-1">
            <button
              @click="player.toggleShuffle()"
              class="transition-colors active:scale-95"
              :class="player.isShuffle ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'"
              title="Acak"
            >
              <Icon name="solar:shuffle-linear" class="w-5 h-5" />
            </button>

            <button class="text-zinc-300 hover:text-white transition-colors active:scale-90" title="Sebelumnya">
              <Icon name="solar:skip-previous-bold" class="w-6 h-6" />
            </button>

            <button
              @click="player.togglePlay()"
              class="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
              :title="player.isPlaying ? 'Jeda' : 'Putar'"
            >
              <Icon
                :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'"
                class="w-6 h-6"
                :class="{ 'ml-0.5': !player.isPlaying }"
              />
            </button>

            <button
              @click="player.playNextTrack()"
              class="text-zinc-300 hover:text-white transition-colors active:scale-90"
              title="Selanjutnya"
            >
              <Icon name="solar:skip-next-bold" class="w-6 h-6" />
            </button>

            <button
              @click="player.toggleRepeat()"
              class="transition-colors active:scale-95"
              :class="player.isRepeat ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'"
              title="Ulangi"
            >
              <Icon name="solar:repeat-linear" class="w-5 h-5" />
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

const activeTab = ref('player') // 'player' | 'lyrics' | 'artist'
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
  return Math.min(100, Math.max(0, (player.currentTime / player.duration) * 100))
})

const handleSeek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = Math.max(0, Math.min(1, clickX / rect.width))
  player.seekTo(percentage * player.duration)
}

// Fetch artist info from Spotify API endpoint
const fetchSpotifyArtist = async () => {
  if (!props.track) return

  loadingArtist.value = true
  artistData.value = null

  try {
    const rawArtistName = props.track.snippet?.channelTitle || ''
    const cleanArtistName = rawArtistName
      .replace(/video|official|topic|vevo|records|music/gi, '')
      .trim()

    const res = await $fetch('/api/spotify', {
      query: { q: cleanArtistName }
    })

    if (!res || res.error) {
      throw new Error('Artis tidak ditemukan')
    }

    artistData.value = {
      id: res.id,
      name: res.name,
      image: res.image,
      popularity: res.popularity,
      topTracks: res.topTracks || []
    }
  } catch (err) {
    artistData.value = null
  } finally {
    loadingArtist.value = false
  }
}

const handleRedirectToArtistPage = () => {
  if (!artistData.value?.id) return
  emit('close')
  navigateTo(`/artist/${artistData.value.id}?name=${encodeURIComponent(artistData.value.name)}`)
}

const handlePlayArtistTrack = async (item) => {
  try {
    const searchRes = await $fetch('/api/tracks', {
      query: { q: `${item.title} ${artistData.value?.name || ''}` }
    })
    const matchedTrack = searchRes?.items?.[0]
    if (matchedTrack) {
      player.playTrack(matchedTrack)
    }
  } catch (err) {
    console.error('Play artist track error:', err)
  }
}

// Parse LRC into objects
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

// Auto-scroll to active lyric line
watch(activeLyricIndex, async (newIndex) => {
  if (activeTab.value === 'lyrics' && lyricsContainer.value && newIndex !== -1) {
    await nextTick()
    const activeElement = lyricsContainer.value.children[newIndex]
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})

// Watch track changes
watch(() => props.track?.id?.videoId, () => {
  fetchLyrics()
  fetchSpotifyArtist()
}, { immediate: true })
</script>
