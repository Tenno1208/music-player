<template>
  <div class="flex h-screen bg-black text-zinc-100 antialiased font-sans selection:bg-rose-600 selection:text-white overflow-hidden">
    
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

      <!-- Bottom Padding for Player -->
      <div class="h-24"></div>
    </div>

    <!-- Global Player Bar -->
    <LayoutPlayerBar />

    <!-- TAMBAHKAN INI: Modal Global untuk Lirik & Detail Artis -->
    <SharedPlayerModal 
      :isOpen="player.isModalOpen" 
      :track="player.currentTrack" 
      @close="player.isModalOpen = false" 
    />

  </div>
</template>

<script setup>
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()
</script>