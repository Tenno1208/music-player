<template>
  <nav
    class="fixed bottom-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50"
  >
    <div class="grid grid-cols-4 h-full">
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center text-zinc-400 hover:text-white"
        active-class="text-rose-500"
      >
        <Icon name="solar:home-2-bold-duotone" class="w-6 h-6" />
        <span class="text-[10px]">Home</span>
      </NuxtLink>

      <NuxtLink
        to="/search"
        class="flex flex-col items-center justify-center text-zinc-400 hover:text-white"
        active-class="text-rose-500"
      >
        <Icon
          name="solar:minimalistic-magnifer-bold-duotone"
          class="w-6 h-6"
        />
        <span class="text-[10px]">Search</span>
      </NuxtLink>

      <NuxtLink
        to="/library"
        class="flex flex-col items-center justify-center text-zinc-400 hover:text-white"
        active-class="text-rose-500"
      >
        <Icon name="solar:library-bold-duotone" class="w-6 h-6" />
        <span class="text-[10px]">Library</span>
      </NuxtLink>

      <NuxtLink
        to="/developer"
        class="flex flex-col items-center justify-center text-zinc-400 hover:text-white"
        active-class="text-rose-500"
      >
        <Icon name="solar:user-circle-bold-duotone" class="w-6 h-6" />
        <span class="text-[10px]">Profile</span>
      </NuxtLink>
    </div>
  </nav>
</template>