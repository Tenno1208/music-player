<template>
  <!-- Bottom Navigation Menu Mewah -->
  <div class="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
    
    <NuxtLink 
      to="/" 
      class="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-all w-16"
      active-class="text-rose-500 font-bold"
    >
      <Icon name="solar:home-2-bold-duotone" class="w-5 h-5 sm:w-6 sm:h-6" />
      <span class="text-[10px] tracking-wide">Home</span>
    </NuxtLink>
    
    <NuxtLink 
      to="/search" 
      class="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-all w-16"
      active-class="text-rose-500 font-bold"
    >
      <Icon name="solar:minimalistic-magnifer-bold-duotone" class="w-5 h-5 sm:w-6 sm:h-6" />
      <span class="text-[10px] tracking-wide">Search</span>
    </NuxtLink>

    <NuxtLink 
      to="/library" 
      class="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-all w-16"
      active-class="text-rose-500 font-bold"
    >
      <Icon name="solar:library-bold-duotone" class="w-5 h-5 sm:w-6 sm:h-6" />
      <span class="text-[10px] tracking-wide">Library</span>
    </NuxtLink>

    <NuxtLink 
      to="/developer" 
      class="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-all w-16"
      active-class="text-rose-500 font-bold"
    >
      <Icon name="solar:user-circle-bold-duotone" class="w-5 h-5 sm:w-6 sm:h-6" />
      <span class="text-[10px] tracking-wide">Developer</span>
    </NuxtLink>

  </div>
</template>