<script setup>
const model = defineModel()
</script>

<template>
  <div class="mb-6 sticky top-[60px] z-40 bg-black/60 backdrop-blur-xl py-3 px-4">
    <div class="relative max-w-2xl mx-auto">
      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
        <Icon name="solar:minimalistic-magnifer-bold-duotone" class="w-5 h-5" />
      </span>
      <input
        v-model="model"
        type="text"
        placeholder="Cari judul lagu, genre, atau musisi..."
        class="w-full bg-zinc-900/60 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50"
      />
    </div>
  </div>
</template>