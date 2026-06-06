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

// Mock Lyrics Data synced with time
const mockLyrics = [
  { time: 0, text: "[Intro: Instrumental]" },
  { time: 10, text: "Yeah, this is how we do it..." },
  { time: 15, text: "Walking down the avenue" },
  { time: 18, text: "Looking at the sky so blue" },
  { time: 22, text: "Everything feels so right" },
  { time: 27, text: "In this beautiful place tonight" },
  { time: 32, text: "We can go anywhere" },
  { time: 36, text: "Just take my hand, I swear" },
  { time: 40, text: "Don't need no destination" },
  { time: 45, text: "No master plan" },
  { time: 50, text: "[Chorus]" },
  { time: 55, text: "Let the music take control" },
  { time: 60, text: "Feel the rhythm in your soul" },
  { time: 65, text: "Every beat is like a fire" },
  { time: 70, text: "Taking us higher and higher" },
  { time: 75, text: "[Outro]" },
  { time: 85, text: "..." }
]

const activeLyricIndex = computed(() => {
  let activeIndex = 0
  for (let i = 0; i < mockLyrics.length; i++) {
    if (player.currentTime >= mockLyrics[i].time) {
      activeIndex = i
    } else {
      break
    }
  }
  return activeIndex
})

// Auto-scroll lyrics smoothly when the active line changes
watch(activeLyricIndex, async (newIndex) => {
  if (activeTab.value === 'lyrics' && lyricsContainer.value) {
    await nextTick()
    const activeElement = lyricsContainer.value.children[newIndex + 1] // +1 for the Sync Lyrics header
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
        <button @click="emit('close')" class="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md">
          <Icon name="solar:alt-arrow-down-bold" class="w-6 h-6" />
        </button>
        <span class="text-xs font-bold tracking-widest text-zinc-300 uppercase">Now Playing</span>
        <button class="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md">
          <Icon name="solar:menu-dots-bold" class="w-6 h-6" />
        </button>
      </div>

      <!-- Main Player Area -->
      <div class="flex-1 flex flex-col relative h-[60vh] md:h-full bg-gradient-to-b from-rose-900/20 to-zinc-950 p-6 md:p-12">
        
        <!-- Desktop Close Button -->
        <button @click="emit('close')" class="hidden md:flex absolute top-8 left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors">
          <Icon name="solar:alt-arrow-down-bold" class="w-7 h-7" />
        </button>

        <div class="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full mt-10 md:mt-0">
          <!-- Album Art -->
          <div class="w-full aspect-square max-h-[45vh] md:max-h-[50vh] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-8 md:mb-12 bg-zinc-900 relative">
            <img 
              :src="track.snippet?.thumbnails?.high?.url || track.snippet?.thumbnails?.medium?.url || track.snippet?.thumbnails?.default?.url" 
              class="w-full h-full object-cover"
              alt="Album Art"
            >
          </div>

          <!-- Song Info -->
          <div class="flex items-end justify-between mb-6">
            <div class="min-w-0 pr-4">
              <h2 class="text-2xl md:text-4xl font-black text-white truncate mb-1">{{ track.snippet?.title }}</h2>
              <p class="text-lg md:text-xl text-zinc-400 font-medium truncate">{{ track.snippet?.channelTitle }}</p>
            </div>
            <button class="text-zinc-400 hover:text-rose-500 transition-colors flex-shrink-0">
              <Icon name="solar:heart-bold" class="w-8 h-8" />
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="mb-6">
            <div 
              class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden group cursor-pointer relative"
              @click="handleSeek"
            >
              <div 
                class="h-full bg-white group-hover:bg-rose-500 relative transition-all duration-300 ease-linear"
                :style="{ width: `${progressPercentage}%` }"
              >
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow scale-110"></div>
              </div>
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-zinc-400 font-medium">
              <span>{{ formatTime(player.currentTime) }}</span>
              <span>{{ formatTime(player.duration) }}</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center justify-between px-2">
            <button class="text-zinc-400 hover:text-white transition-colors">
              <Icon name="solar:shuffle-bold" class="w-6 h-6 md:w-7 md:h-7" />
            </button>
            <button class="text-white hover:text-zinc-300 transition-colors">
              <Icon name="solar:skip-previous-bold" class="w-10 h-10 md:w-12 md:h-12" />
            </button>
            <button 
              @click="player.togglePlay()"
              class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Icon :name="player.isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="w-8 h-8 md:w-10 md:h-10" :class="{'ml-1 md:ml-1.5': !player.isPlaying}" />
            </button>
            <button class="text-white hover:text-zinc-300 transition-colors">
              <Icon name="solar:skip-next-bold" class="w-10 h-10 md:w-12 md:h-12" />
            </button>
            <button class="text-zinc-400 hover:text-white transition-colors">
              <Icon name="solar:repeat-bold" class="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right Side / Bottom Tabs (Lyrics & Artist Info) -->
      <div class="w-full md:w-[400px] lg:w-[500px] h-[40vh] md:h-full bg-zinc-900 border-l border-white/5 flex flex-col">
        <!-- Tabs Header -->
        <div class="flex p-2 bg-zinc-950/50 backdrop-blur-md">
          <button 
            @click="activeTab = 'lyrics'"
            class="flex-1 py-3 text-sm font-bold rounded-lg transition-all"
            :class="activeTab === 'lyrics' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'"
          >
            Lyrics
          </button>
          <button 
            @click="activeTab = 'artist'"
            class="flex-1 py-3 text-sm font-bold rounded-lg transition-all"
            :class="activeTab === 'artist' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'"
          >
            About Artist
          </button>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          <!-- Lyrics Tab -->
          <div v-if="activeTab === 'lyrics'" class="space-y-6 pb-20" ref="lyricsContainer">
            <div class="inline-block px-3 py-1 bg-white/10 rounded-md text-xs font-bold text-white mb-6">
              Sync Lyrics
            </div>
            
            <div 
              v-for="(line, index) in mockLyrics" 
              :key="index"
              class="text-2xl md:text-3xl font-bold leading-relaxed transition-all duration-500 cursor-pointer mb-6"
              :class="{
                'text-white opacity-100': activeLyricIndex === index,
                'text-zinc-300 opacity-30 blur-[1px] hover:blur-none hover:opacity-100': activeLyricIndex !== index,
                'text-rose-400': activeLyricIndex === index && player.isPlaying
              }"
              @click="player.seekTo(line.time)"
            >
              {{ line.text }}
            </div>

            <p class="text-sm text-zinc-600 mt-16 font-medium">Lyrics provided by MonteraRed Mock Data</p>
          </div>

          <!-- Artist Tab -->
          <div v-else-if="activeTab === 'artist'" class="space-y-6">
            <div class="relative w-full h-48 rounded-xl overflow-hidden mb-4 group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1516280440502-65f6c5240f8a?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <p class="text-white font-black text-2xl drop-shadow-md">{{ track.snippet?.channelTitle }}</p>
                <p class="text-zinc-300 text-sm font-medium">2.4M Monthly Listeners</p>
              </div>
            </div>
            
            <p class="text-zinc-300 text-sm leading-relaxed">
              {{ track.snippet?.channelTitle }} is an independent artist known for creating immersive soundscapes and captivating melodies. With a unique blend of genres, they have captured the hearts of millions of listeners worldwide.
            </p>
            
            <div class="pt-4 border-t border-white/10">
              <h4 class="text-white font-bold mb-4">On Tour</h4>
              <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                <div>
                  <p class="text-white font-bold text-sm">Oct 24</p>
                  <p class="text-zinc-400 text-xs">Jakarta, Indonesia</p>
                </div>
                <Icon name="solar:alt-arrow-right-bold" class="w-5 h-5 text-white" />
              </div>
            </div>
            
            <button class="w-full py-3 rounded-full border border-white/20 text-white font-bold text-sm hover:border-white transition-colors mt-4">
              Follow Artist
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
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Custom Scrollbar for Tabs */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>