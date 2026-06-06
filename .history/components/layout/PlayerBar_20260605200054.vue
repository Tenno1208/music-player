<script setup>
import { usePlayerStore } from '~/stores/player'

const player = usePlayerStore()
</script>

<template>
  <div
    v-if="player.currentTrack"
    class="fixed bottom-16 left-0 right-0 bg-zinc-950 border-t border-white/5 z-50"
  >

    <!-- MOBILE -->
    <div class="md:hidden px-3 py-2">

      <div class="flex items-center gap-3">

        <img
          :src="player.currentTrack.snippet?.thumbnails?.default?.url"
          class="w-12 h-12 rounded-lg object-cover"
          alt="Cover"
        >

        <div class="flex-1 min-w-0">
          <p class="text-white text-sm font-medium truncate">
            {{ player.currentTrack.snippet?.title }}
          </p>

          <p class="text-zinc-400 text-xs truncate">
            {{ player.currentTrack.snippet?.channelTitle }}
          </p>
        </div>

        <button
          @click="player.togglePlay()"
          class="text-white"
        >
          <Icon
            :name="player.isPlaying
              ? 'solar:pause-circle-bold'
              : 'solar:play-circle-bold'"
            class="w-10 h-10"
          />
        </button>

      </div>

      <!-- Progress -->
      <div class="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div class="h-full w-1/3 bg-rose-500"></div>
      </div>

    </div>

    <!-- DESKTOP -->
    <div
      class="hidden md:flex h-20 px-4 items-center justify-between"
    >

      <!-- Left -->
      <div class="flex items-center gap-4 w-[30%] min-w-[220px]">

        <img
          :src="player.currentTrack.snippet?.thumbnails?.default?.url"
          class="w-14 h-14 rounded-md object-cover"
          alt="Cover"
        >

        <div class="min-w-0">
          <h4 class="text-sm font-semibold text-white truncate">
            {{ player.currentTrack.snippet?.title }}
          </h4>

          <p class="text-xs text-zinc-400 truncate">
            {{ player.currentTrack.snippet?.channelTitle }}
          </p>
        </div>

        <button
          class="text-zinc-400 hover:text-rose-500 transition"
        >
          <Icon
            name="solar:heart-bold"
            class="w-5 h-5"
          />
        </button>

      </div>

      <!-- Center -->
      <div
        class="flex flex-col items-center justify-center flex-1 max-w-xl"
      >

        <div class="flex items-center gap-5">

          <button class="text-zinc-400 hover:text-white">
            <Icon
              name="solar:shuffle-bold"
              class="w-5 h-5"
            />
          </button>

          <button class="text-zinc-400 hover:text-white">
            <Icon
              name="solar:skip-previous-bold"
              class="w-6 h-6"
            />
          </button>

          <button
            @click="player.togglePlay()"
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center"
          >
            <Icon
              :name="player.isPlaying
                ? 'solar:pause-bold'
                : 'solar:play-bold'"
              class="w-5 h-5"
            />
          </button>

          <button class="text-zinc-400 hover:text-white">
            <Icon
              name="solar:skip-next-bold"
              class="w-6 h-6"
            />
          </button>

          <button class="text-zinc-400 hover:text-white">
            <Icon
              name="solar:repeat-bold"
              class="w-5 h-5"
            />
          </button>

        </div>

        <div class="w-full flex items-center gap-2 mt-2">

          <span class="text-[11px] text-zinc-500">
            1:03
          </span>

          <div
            class="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden"
          >
            <div
              class="h-full w-1/3 bg-zinc-300"
            ></div>
          </div>

          <span class="text-[11px] text-zinc-500">
            3:45
          </span>

        </div>

      </div>

      <!-- Right -->
      <div
        class="w-[30%] min-w-[220px] flex items-center justify-end gap-4"
      >

        <button class="text-zinc-400 hover:text-white">
          <Icon
            name="solar:microphone-2-bold"
            class="w-5 h-5"
          />
        </button>

        <button class="text-zinc-400 hover:text-white">
          <Icon
            name="solar:list-bold"
            class="w-5 h-5"
          />
        </button>

        <button class="text-zinc-400 hover:text-white">
          <Icon
            name="solar:devices-bold"
            class="w-5 h-5"
          />
        </button>

        <div class="flex items-center gap-2 w-24">

          <Icon
            name="solar:volume-loud-bold"
            class="w-5 h-5 text-zinc-400"
          />

          <div
            class="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden"
          >
            <div
              class="h-full w-2/3 bg-zinc-300"
            ></div>
          </div>

        </div>

      </div>

    </div>

    <!-- Hidden YouTube -->
    <iframe
      v-if="player.currentTrack && player.isPlaying"
      :src="`https://www.youtube.com/embed/${player.currentTrack.id.videoId}?autoplay=1`"
      allow="autoplay"
      class="fixed opacity-0 pointer-events-none w-0 h-0"
    />

  </div>
</template>