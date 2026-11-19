<template>
  <section class="space-y-4">
    <!-- Section Header -->
    <div class="flex items-end justify-between gap-4">
      <div class="min-w-0">
        <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight truncate cursor-pointer hover:underline decoration-2 underline-offset-4">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-xs text-zinc-500 font-medium mt-0.5 truncate">
          {{ subtitle }}
        </p>
      </div>

      <!-- "Tampilkan Semua" + panah (desktop) -->
      <div class="hidden sm:flex items-center flex-shrink-0">
        <NuxtLink
          v-if="showAllLink"
          :to="showAllLink"
          class="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mr-3"
        >
          Tampilkan Semua
        </NuxtLink>

        <button
          @click="scroll('left')"
          :disabled="!canLeft"
          aria-label="Geser kiri"
          class="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition flex items-center justify-center border border-white/[0.06] disabled:opacity-25 disabled:cursor-default disabled:hover:bg-white/[0.05]"
        >
          <Icon name="solar:alt-arrow-left-linear" class="w-4 h-4" />
        </button>
        <button
          @click="scroll('right')"
          :disabled="!canRight"
          aria-label="Geser kanan"
          class="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition flex items-center justify-center border border-white/[0.06] disabled:opacity-25 disabled:cursor-default disabled:hover:bg-white/[0.05]"
        >
          <Icon name="solar:alt-arrow-right-linear" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Carousel -->
    <div
      ref="scrollContainer"
      @scroll.passive="updateArrows"
      class="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <article
        v-for="(item, index) in items"
        :key="item.id ?? index"
        tabindex="0"
        @click="handleItemClick(item)"
        @keydown.enter="handleItemClick(item)"
        class="group relative flex-shrink-0 w-[140px] sm:w-[175px] p-3 rounded-2xl cursor-pointer border border-transparent transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.08] focus:outline-none focus-visible:bg-white/[0.05]"
      >
        <!-- Cover -->
        <div
          class="relative w-full aspect-square mb-3 bg-zinc-900 overflow-hidden border border-white/[0.06] shadow-lg shadow-black/40"
          :class="isArtist ? 'rounded-full' : 'rounded-xl'"
        >
          <img
            v-if="item.image"
            :src="item.image"
            class="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
            alt="Cover"
            loading="lazy"
          />
          <!-- Fallback gradient kalau image kosong -->
          <div v-else class="w-full h-full bg-gradient-to-br flex items-center justify-center" :class="palette(index)">
            <Icon name="solar:music-notes-bold" class="w-8 h-8 text-white/40" />
          </div>

          <!-- Play button ala Spotify: muncul dari pojok kanan bawah -->
          <button
            @click.stop="emit('play', item)"
            aria-label="Putar"
            class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 transition-all duration-300 shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95"
          >
            <Icon name="solar:play-bold" class="w-5 h-5 ml-0.5" />
          </button>
        </div>

        <!-- Metadata -->
        <div :class="isArtist ? 'text-center' : 'text-left'">
          <h3 class="font-semibold text-xs sm:text-sm text-zinc-100 truncate group-hover:text-rose-400 transition-colors">
            {{ item.name }}
          </h3>
          <p class="text-[11px] text-zinc-500 truncate font-medium mt-0.5">
            {{ item.description || item.subtitle || (isArtist ? 'Artis' : 'Album') }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  items: { type: Array, required: true },
  isArtist: { type: Boolean, default: false },
  showAllLink: { type: String, default: '' }
})

const emit = defineEmits(['play'])

const scrollContainer = ref(null)
const canLeft = ref(false)
const canRight = ref(false)

// Warna fallback bergilir biar kartu tanpa gambar tetap cantik
const palettes = [
  'from-rose-500/40 via-rose-900/30 to-zinc-900',
  'from-indigo-500/40 via-indigo-900/30 to-zinc-900',
  'from-amber-500/40 via-amber-900/30 to-zinc-900',
  'from-emerald-500/40 via-emerald-900/30 to-zinc-900',
  'from-sky-500/40 via-sky-900/30 to-zinc-900',
  'from-fuchsia-500/40 via-fuchsia-900/30 to-zinc-900'
]
const palette = (i) => palettes[i % palettes.length]

const updateArrows = () => {
  const el = scrollContainer.value
  if (!el) return
  canLeft.value = el.scrollLeft > 8
  canRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 8
}

const scroll = (direction) => {
  const el = scrollContainer.value
  if (!el) return
  const offset = el.clientWidth * 0.8
  el.scrollBy({ left: direction === 'left' ? -offset : offset, behavior: 'smooth' })
}

const handleItemClick = (item) => {
  if (props.isArtist) {
    navigateTo(`/artist/${item.id}?name=${encodeURIComponent(item.name)}`)
  } else if (item.artistId) {
    navigateTo(`/artist/${item.artistId}?name=${encodeURIComponent(item.artistName)}`)
  }
}

onMounted(() => {
  updateArrows()
  window.addEventListener('resize', updateArrows)
})
onBeforeUnmount(() => window.removeEventListener('resize', updateArrows))
</script>