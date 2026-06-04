<template>
  <div class="min-h-screen bg-black text-zinc-100 antialiased font-sans selection:bg-red-600 selection:text-white">
    
    <!-- Spotify Style Navigation Bar -->
    <nav class="sticky top-0 z-50 border-b border-zinc-900 bg-black/70 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        <!-- Logo Brand -->
        <div class="flex items-center gap-2.5 group cursor-pointer">
          <!-- Logo bergaya wave/sound icon berwarna merah -->
          <div class="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <div>
            <h1 class="font-black text-base sm:text-lg tracking-tight text-white uppercase flex items-center gap-1">
              Montera<span class="text-red-500">Red</span>
            </h1>
          </div>
        </div>

        <!-- Right Indicator -->
        <div class="flex items-center gap-3">
          <span class="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          <span class="text-[11px] font-bold tracking-widest text-zinc-400 uppercase hidden sm:inline">Premium Player</span>
        </div>

      </div>
    </nav>

    <!-- Main Content Layout -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <slot />
    </main>

  </div>
</template>