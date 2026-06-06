<script setup>
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()
</script>

<template>
  <div class="px-6 py-10">
    <div class="flex items-center gap-4 mb-8">
      <div class="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center shadow-lg">
        <Icon name="solar:history-bold" class="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 class="text-3xl font-black text-white">Your Library</h1>
        <p class="text-sm text-zinc-400 font-medium mt-1">Recently played tracks</p>
      </div>
    </div>

    <div v-if="player.history.length === 0" class="text-center py-20 bg-white/5 rounded-xl border border-white/5">
      <Icon name="solar:ghost-bold-duotone" class="w-16 h-16 text-zinc-600 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-white mb-2">It's a bit empty here</h3>
      <p class="text-zinc-400 text-sm mb-6">Play some tracks to build your listening history.</p>
      <NuxtLink to="/search" class="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform inline-block">
        Find Music
      </NuxtLink>
    </div>

    <div v-else>
      <SharedTrackList :tracks="player.history" />
    </div>
  </div>
</template>
