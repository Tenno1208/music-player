<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-zinc-950 flex flex-col md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[450px] md:h-[85vh] md:rounded-3xl md:border md:border-white/10 md:shadow-2xl overflow-hidden">
      
      <!-- Background Blur Efek Musik -->
      <div class="absolute inset-0 bg-gradient-to-b from-rose-900/30 to-zinc-950 pointer-events-none z-0"></div>

      <!-- Header Modal -->
      <div class="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button @click="$emit('close')" class="p-2 -ml-2 text-zinc-400 hover:text-white active:scale-95 transition-transform">
          <Icon name="solar:alt-arrow-down-bold" class="w-6 h-6" />
        </button>
        <span class="text-xs font-bold tracking-widest text-zinc-400 uppercase text-center flex-1">Now Playing</span>
        <button class="p-2 -mr-2 text-zinc-400 hover:text-white">
          <Icon name="solar:menu-dots-bold" class="w-5 h-5" />
        </button>
      </div>

      <!-- Konten Utama (Bisa di-scroll jika layar hp pendek) -->
      <div class="relative z-10 flex-1 overflow-y-auto px-6 py-4 scrollbar-hide space-y-6">
        
        <!-- Big Cover Art -->
        <div class="w-full aspect-square max-w-[320px] mx-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(225,29,72,0.3)] border border-white/10 bg-zinc-900">
          <img :src="track?.snippet?.thumbnails?.high?.url || track?.snippet?.thumbnails?.medium?.url" class="w-full h-full object-cover" alt="Cover Art" />
        </div>

        <!-- Detail Lagu & Tombol Navigasi Menu -->
        <div class="flex items-start justify-between gap-4 mt-2">
          <div class="min-w-0 flex-1">
            <h2 class="text-xl sm:text-2xl font-black text-white truncate">{{ track?.snippet?.title }}</h2>
            <p class="text-zinc-400 text-sm truncate hover:underline cursor-pointer mt-0.5" @click="goToArtist">
              {{ track?.snippet?.channelTitle }}
            </p>
          </div>
          
          <!-- Tombol Aksi Menu: Lihat Artis -->
          <button 
            @click="goToArtist"
            class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-200 rounded-full border border-white/10 active:scale-95 transition-all"
          >
            <Icon name="solar:user-speak-bold" class="w-3.5 h-3.5 text-rose-500" />
            <span>Artis</span>
          </button>
        </div>

        <!-- Progress Bar Musik Simulasi -->
        <div class="space-y-1">
          <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative cursor-pointer">
            <div class="h-full w-1/3 bg-rose-600 rounded-full"></div>
          </div>
          <div class="flex justify-between text-[11px] text-zinc-500 font-medium">
            <span>1:15</span>
            <span>3:45</span>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="flex items-center justify-center gap-6 sm:gap-8 py-2">
          <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:shuffle-bold" class="w-5 h-5" /></button>
          <button class="text-white hover:text-rose-400 transition-colors active:scale-90"><Icon name="solar:skip-previous-bold" class="w-7 h-7" /></button>
          
          <!-- Play / Pause Bulat Besar -->
          <button class="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/20 active:scale-95 transition-transform">
            <Icon name="solar:pause-bold" class="w-7 h-7" />
          </button>
          
          <button class="text-white hover:text-rose-400 transition-colors active:scale-90"><Icon name="solar:skip-next-bold" class="w-7 h-7" /></button>
          <button class="text-zinc-400 hover:text-white transition-colors"><Icon name="solar:repeat-bold" class="w-5 h-5" /></button>
        </div>

        <!-- Bagian Menu Lirik Terintegrasi (Box Estetik ala Spotify) -->
        <div class="bg-rose-950/40 border border-rose-500/10 rounded-2xl p-5 space-y-3 shadow-inner">
          <div class="flex items-center justify-between text-rose-400 text-xs font-bold tracking-wider uppercase">
            <div class="flex items-center gap-1.5">
              <Icon name="solar:notes-bold" class="w-4 h-4" />
              <span>Lyrics Menu</span>
            </div>
          </div>
          <!-- Isi Lirik Dinamis / Dummy -->
          <div class="space-y-2 text-sm font-bold text-rose-100/70 leading-relaxed max-h-[150px] overflow-y-auto pr-1">
            <p class="text-white text-base">Ini baris lirik yang sedang bernyanyi...</p>
            <p>Dan ini baris lirik selanjutnya di lagu ini</p>
            <p>Lirik otomatis menyesuaikan dengan lagu</p>
            <p>Sangat rapi diakses via mobile device kamu</p>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  track: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const goToArtist = () => {
  if (props.track?.snippet?.channelTitle) {
    alert(`Mengarahkan ke halaman artis: ${props.track.snippet.channelTitle}`)
    // Di sini kamu bisa ganti pakai router push jika punya halaman musisi:
    // useRouter().push(`/artist?name=${props.track.snippet.channelTitle}`)
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