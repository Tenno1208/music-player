<template>
  <div class="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-rose-500/30 selection:text-white font-sans">
    
    <!-- Sidebar Navigation (Desktop Fixed w-64 & Mobile Bottom Dock) -->
    <LayoutSidebar />

    <!-- Main Viewport Area (offset on desktop by sidebar width) -->
    <div class="md:pl-64 flex flex-col min-h-screen">
      <!-- Topbar Header -->
      <LayoutTopbar />

      <!-- Main Page Content Slot (with breathing room at bottom for player bar) -->
      <main class="flex-1 pb-40 md:pb-28">
        <slot />
      </main>
    </div>

    <!-- Global Floating Audio Player Bar -->
    <LayoutPlayerBar />

    <!-- Fullscreen / Sheet Synchronized Lyrics & Details Modal -->
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
