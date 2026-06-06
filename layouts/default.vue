<template>
  <div class="flex flex-col h-screen bg-black text-zinc-100 antialiased font-sans selection:bg-rose-600 selection:text-white overflow-hidden">
    
    <!-- Area Atas: Layout Flex Horizontal (Sidebar + Main) -->
    <div class="flex-1 flex min-h-0 relative">
      <!-- Left Sidebar -->
      <LayoutSidebar />
  
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 bg-[#121212] relative overflow-y-auto overflow-x-hidden" id="main-scroll">
        <LayoutTopbar>
          <template #search v-if="$slots.search">
            <slot name="search" />
          </template>
        </LayoutTopbar>
  
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>

    <!-- Area Bawah: Ruang kosong (placeholder) yang akan diisi oleh Player Bar -->
    <!-- Saat lagu diputar, UI atas otomatis mengecil ke atas agar tidak ada yang tertutup -->
    <div v-if="player.currentTrack" class="flex-none h-[76px] md:h-20 w-full transition-all duration-300"></div>

    <!-- Global Player Bar -->
    <LayoutPlayerBar />

    <!-- TAMBAHKAN INI: Modal Global untuk Lirik & Detail Artis -->
    <SharedPlayerModal 
      :isOpen="player.isModalOpen" 
      :track="player.currentTrack" 
      @close="player.isModalOpen = false" 
    />

    <!-- Global YouTube API Player -->
    <SharedYoutubePlayer />

  </div>
</template>

<script setup>
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()
</script>