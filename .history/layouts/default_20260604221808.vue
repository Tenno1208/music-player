<template>
  <div class="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100 antialiased font-sans">
    
    <nav class="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        <div class="flex items-center gap-3.5">
          <div class="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-black shadow-lg shadow-emerald-500/10 text-lg tracking-wider">
            M
          </div>
          
          <div>
            <h1 class="font-extrabold text-sm sm:text-base tracking-wide text-white uppercase">
              Montera Play
            </h1>
            <p class="text-[10px] sm:text-xs text-zinc-400 font-medium">
              Powered by YouTube Embed API
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-semibold text-zinc-400 tracking-wider hidden sm:inline">LIVE STREAMING</span>
        </div>

      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <slot />
    </main>

  </div>
</template>