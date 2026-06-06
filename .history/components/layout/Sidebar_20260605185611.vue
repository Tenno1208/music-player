<template>
  <aside class="w-64 bg-black border-r border-white/5 flex flex-col h-full hidden md:flex flex-shrink-0 z-50">
    <!-- Logo -->
    <div class="p-6">
      <NuxtLink to="/" class="flex items-center gap-3 group cursor-pointer w-fit">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-800 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 group-hover:shadow-rose-600/40 group-hover:scale-105 transition-all duration-300 border border-white/10">
          <Icon name="solar:vinyl-record-bold-duotone" class="h-6 w-6" />
        </div>
        <div>
          <h1 class="font-black text-xl tracking-tight text-white uppercase flex items-center gap-1.5 drop-shadow-md">
            Montera<span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600">Red</span>
          </h1>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
      <NuxtLink to="/" class="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white font-semibold">
        <Icon name="solar:home-2-bold-duotone" class="w-6 h-6" />
        Home
      </NuxtLink>
      
      <NuxtLink to="/search" class="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white font-semibold">
        <Icon name="solar:minimalistic-magnifer-bold-duotone" class="w-6 h-6" />
        Search
      </NuxtLink>

      <NuxtLink to="/library" class="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white font-semibold">
        <Icon name="solar:library-bold-duotone" class="w-6 h-6" />
        Your Library
      </NuxtLink>

      <div class="pt-6 pb-2 px-4">
        <p class="text-xs font-bold text-zinc-500 uppercase tracking-wider">About</p>
      </div>

      <NuxtLink to="/developer" class="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" active-class="bg-white/10 text-white font-semibold">
        <Icon name="solar:user-circle-bold-duotone" class="w-6 h-6" />
        Developer
      </NuxtLink>
    </nav>
  </aside>
</template>
