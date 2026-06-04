<template>
  <div class="min-h-screen bg-black text-zinc-100 antialiased font-sans selection:bg-rose-600 selection:text-white">

    <!-- Navigation Bar -->
    <nav class="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">

        <!-- Logo Brand -->
        <div class="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-500 to-red-800 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 group-hover:shadow-rose-600/40 group-hover:scale-105 transition-all duration-300 border border-white/10">
            <Icon name="solar:vinyl-record-bold-duotone" class="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 class="font-black text-base sm:text-xl tracking-tight text-white uppercase flex items-center gap-1 sm:gap-1.5 drop-shadow-md">
              Montera<span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600">Red</span>
            </h1>
          </div>
        </div>

        <!-- Right Menu -->
        <div class="flex items-center gap-3 sm:gap-5">
          <button class="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200">
            <Icon name="solar:compass-bold-duotone" class="w-5 h-5" />
            <span class="text-sm font-medium">Explore</span>
          </button>
          <button class="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200">
            <Icon name="solar:library-bold-duotone" class="w-5 h-5" />
            <span class="text-sm font-medium">Library</span>
          </button>
          
          <div class="h-4 w-px bg-white/10 hidden md:block"></div>

          <div class="hidden xs:flex sm:flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-inner">
            <span class="inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
            <span class="hidden sm:inline text-[10px] sm:text-xs font-bold tracking-widest text-zinc-300 uppercase">Premium</span>
          </div>
          
          <button class="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
            <Icon name="solar:bell-bing-bold-duotone" class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <img src="https://i.pravatar.cc/100?img=33" alt="Profile" class="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-rose-900/50 object-cover cursor-pointer hover:border-rose-500 transition-colors" />
        </div>

      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <slot />
    </main>

  </div>
</template>