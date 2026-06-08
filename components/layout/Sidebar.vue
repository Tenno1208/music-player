<template>
  <nav
    class="fixed bottom-4 left-4 right-4 h-14 bg-[#16161a]/80 backdrop-blur-xl border border-white/5 rounded-2xl z-50 shadow-2xl shadow-black/50 md:hidden overflow-hidden"
  >
    <div class="grid grid-cols-4 h-full px-2">
      <!-- Home -->
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-200 transition-all duration-300 group"
        active-class="active-nav"
      >
        <div class="p-1 rounded-xl transition-all group-[.active-nav]:bg-rose-500/10 group-[.active-nav]:text-rose-500">
          <Icon name="solar:home-2-bold-duotone" class="w-5 h-5 transform group-active:scale-90 transition-transform" />
        </div>
        <span class="text-[9px] font-black uppercase tracking-wider group-[.active-nav]:text-rose-400">Home</span>
      </NuxtLink>

      <!-- Search -->
      <NuxtLink
        to="/search"
        class="flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-200 transition-all duration-300 group"
        active-class="active-nav"
      >
        <div class="p-1 rounded-xl transition-all group-[.active-nav]:bg-rose-500/10 group-[.active-nav]:text-rose-500">
          <Icon name="solar:minimalistic-magnifer-bold-duotone" class="w-5 h-5 transform group-active:scale-90 transition-transform" />
        </div>
        <span class="text-[9px] font-black uppercase tracking-wider group-[.active-nav]:text-rose-400">Search</span>
      </NuxtLink>

      <!-- Library -->
      <NuxtLink
        to="/library"
        class="flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-200 transition-all duration-300 group"
        active-class="active-nav"
      >
        <div class="p-1 rounded-xl transition-all group-[.active-nav]:bg-rose-500/10 group-[.active-nav]:text-rose-500">
          <Icon name="solar:library-bold-duotone" class="w-5 h-5 transform group-active:scale-90 transition-transform" />
        </div>
        <span class="text-[9px] font-black uppercase tracking-wider group-[.active-nav]:text-rose-400">Library</span>
      </NuxtLink>

      <!-- Profile / Developer -->
      <NuxtLink
        to="/developer"
        class="flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-200 transition-all duration-300 group"
        active-class="active-nav"
      >
        <div class="p-1 rounded-xl transition-all group-[.active-nav]:bg-rose-500/10 group-[.active-nav]:text-rose-500">
          <Icon name="solar:user-circle-bold-duotone" class="w-5 h-5 transform group-active:scale-90 transition-transform" />
        </div>
        <span class="text-[9px] font-black uppercase tracking-wider group-[.active-nav]:text-rose-400">Profile</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
/* Transisi warna halus saat rute aktif terdeteksi */
.router-link-active {
  color: #f43f5e !important;
}
</style>