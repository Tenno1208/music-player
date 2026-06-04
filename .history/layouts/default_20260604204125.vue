<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
    <nav class="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="h-8 w-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center font-bold text-black text-sm tracking-wider">
          NX
        </div>
        <span class="font-bold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          Nuxt Stream
        </span>
      </div>
      <div class="flex items-center space-x-6 text-sm font-medium text-zinc-400">
        <a href="#" class="text-white transition">Discover</a>
        <a href="#" class="hover:text-white transition">Playlists</a>
        <a href="#" class="hover:text-white transition">Premium</a>
      </div>
    </nav>

    <main class="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8">
      <slot />
    </main>
  </div>
</template>