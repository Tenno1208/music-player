<script setup>
const route = useRoute()
</script>

<template>
  <div class="h-16 bg-black/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
    <div class="flex items-center gap-2">
      <!-- Back/Forward buttons like Spotify -->
      <button class="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-zinc-400 hover:text-white">
        <Icon name="solar:alt-arrow-left-bold" class="w-5 h-5" />
      </button>
      <button class="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-zinc-400 hover:text-white">
        <Icon name="solar:alt-arrow-right-bold" class="w-5 h-5" />
      </button>
    </div>

    <!-- Search input in topbar if on search page -->
    <div v-if="route.path === '/search'" class="flex-1 max-w-sm mx-4">
      <div class="relative w-full">
        <Icon name="solar:minimalistic-magnifer-bold" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          id="global-search"
          type="text"
          placeholder="What do you want to listen to?"
          class="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm rounded-full pl-10 pr-10 py-2.5 border border-transparent focus:border-white/20 focus:outline-none transition-all placeholder:text-zinc-400 font-medium"
        />
      </div>
    </div>

    <div class="flex items-center gap-4 ml-auto">
      <div class="hidden xs:flex sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer">
        <span class="text-xs font-bold tracking-widest text-white uppercase">Explore Premium</span>
      </div>
      <button class="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-zinc-400 hover:text-white">
        <Icon name="solar:bell-bing-bold-duotone" class="w-5 h-5" />
      </button>
      <img src="https://i.pravatar.cc/100?img=33" alt="Profile" class="h-8 w-8 rounded-full border-2 border-transparent hover:border-zinc-500 object-cover cursor-pointer transition-colors" />
    </div>
  </div>
</template>