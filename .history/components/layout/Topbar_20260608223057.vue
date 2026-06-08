<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '~/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const goBack = () => router.back()
const goForward = () => router.forward()
</script>

<template>
  <header
    class="sticky top-0 z-40 h-16 bg-black/70 backdrop-blur-2xl border-b border-white/5"
  >
    <div class="h-full flex items-center justify-between px-4 md:px-6">

      <!-- Left -->
      <div class="flex items-center gap-3">

        <div
          class="hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 items-center justify-center shadow-lg shadow-red-900/30"
        >
          <Icon
            name="solar:vinyl-record-bold-duotone"
            class="w-6 h-6 text-white"
          />
        </div>

        <div class="hidden md:flex gap-2">

          <button
            @click="goBack"
            class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
          >
            <Icon
              name="solar:alt-arrow-left-bold"
              class="w-5 h-5 mx-auto"
            />
          </button>

          <button
            @click="goForward"
            class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
          >
            <Icon
              name="solar:alt-arrow-right-bold"
              class="w-5 h-5 mx-auto"
            />
          </button>

        </div>

      </div>

      <!-- Search -->
      <div
        v-if="route.path === '/search'"
        class="flex-1 max-w-2xl mx-2 md:mx-8"
      >
        <div class="relative">

          <Icon
            name="solar:minimalistic-magnifer-bold-duotone"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5"
          />

          <input
            v-model="searchStore.search"
            type="text"
            placeholder="Cari lagu, artis, album..."
            class="w-full h-12 rounded-full bg-zinc-900/70 border border-white/5 text-white pl-12 pr-10 outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition"
          >

          <button
            v-if="searchStore.search"
            @click="searchStore.clearSearch"
            class="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Icon
              name="solar:close-circle-bold"
              class="w-5 h-5 text-zinc-500 hover:text-white"
            />
          </button>

        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-3">

        <button
          class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"
        >
          <Icon
            name="solar:bell-bing-bold-duotone"
            class="w-5 h-5"
          />
        </button>

        <button
          class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"
        >
          <Icon
            name="solar:settings-bold-duotone"
            class="w-5 h-5"
          />
        </button>

        <div class="relative">
          <div
            class="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 blur opacity-60"
          ></div>

          <img
            src="https://i.pravatar.cc/100?img=33"
            class="relative w-10 h-10 rounded-full border border-black object-cover"
          >
        </div>

      </div>

    </div>

    <!-- Gradient Bottom -->
    <div
      class="h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent"
    ></div>

  </header>
</template>