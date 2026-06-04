<template>
  <div
    class="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white"
  >

    <nav
      class="sticky top-0 z-50 border-b border-zinc-800 bg-black/40 backdrop-blur-xl"
    >

      <div
        class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
      >

        <div class="flex items-center gap-3">

          <div
            class="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-black"
          >
            N
          </div>

          <div>
            <h1 class="font-bold">
              Nuxt Music
            </h1>

            <p class="text-xs text-zinc-500">
              Powered by Jamendo
            </p>
          </div>

        </div>

      </div>

    </nav>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <slot />
    </main>

  </div>
</template>