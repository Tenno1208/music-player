<template>
  <div class="bg-gradient-to-b from-rose-950/60 via-zinc-900/40 to-transparent p-5 sm:p-8 rounded-b-3xl mb-6 relative overflow-hidden">
    <!-- Dekorasi Efek Cahaya Ambient di Background -->
    <div class="absolute top-0 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    
    <div class="flex flex-col gap-6 mt-2 sm:mt-6">
      
      <!-- Baris Atas: Sapaan Pengguna & Waktu Dinamis -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] md:text-xs font-black text-rose-500 tracking-widest uppercase bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/10">
            Dengarkan Sekarang
          </span>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2 drop-shadow-md">
            {{ greetingTime }}, MonteraRed!
          </h1>
          <p class="text-zinc-400 text-xs sm:text-sm font-medium mt-1">
            Siap untuk menjelajahi musik tanpa gangguan hari ini?
          </p>
        </div>
      </div>

      <!-- Quick Shortcuts Grid: Menggantikan visual 1 playlist besar menjadi 4 album/kategori cepat -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        
        <!-- Card 1: Top Global -->
        <div class="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group cursor-pointer backdrop-blur-sm">
          <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=150" class="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover bg-zinc-800 shadow" alt="Top Global" />
          <div class="min-w-0 flex-1">
            <p class="text-xs md:text-sm font-bold text-white truncate">Top 50 - Global</p>
            <p class="text-[10px] text-zinc-400 truncate mt-0.5">Lagu terpopuler dunia</p>
          </div>
          <button class="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100 flex-shrink-0 mr-1">
            <Icon name="solar:play-bold" class="w-4 h-4" />
          </button>
        </div>

        <!-- Card 2: Hits Indonesia -->
        <div class="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group cursor-pointer backdrop-blur-sm">
          <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=150" class="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover bg-zinc-800 shadow" alt="Hits Indonesia" />
          <div class="min-w-0 flex-1">
            <p class="text-xs md:text-sm font-bold text-white truncate">Hits Indonesia</p>
            <p class="text-[10px] text-zinc-400 truncate mt-0.5">Populer saat ini</p>
          </div>
          <button class="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100 flex-shrink-0 mr-1">
            <Icon name="solar:play-bold" class="w-4 h-4" />
          </button>
        </div>

        <!-- Card 3: Chill Acoustic -->
        <div class="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group cursor-pointer backdrop-blur-sm">
          <img src="https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=150" class="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover bg-zinc-800 shadow" alt="Chill Acoustic" />
          <div class="min-w-0 flex-1">
            <p class="text-xs md:text-sm font-bold text-white truncate">Chill Acoustic</p>
            <p class="text-[10px] text-zinc-400 truncate mt-0.5">Santai & santun</p>
          </div>
          <button class="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100 flex-shrink-0 mr-1">
            <Icon name="solar:play-bold" class="w-4 h-4" />
          </button>
        </div>

        <!-- Card 4: Favorit Kamu -->
        <div class="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group cursor-pointer backdrop-blur-sm">
          <div class="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow flex-shrink-0">
            <Icon name="solar:heart-bold" class="w-6 h-6 text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs md:text-sm font-bold text-white truncate">Lagu Disukai</p>
            <p class="text-[10px] text-zinc-400 truncate mt-0.5">Koleksi pribadi Anda</p>
          </div>
          <button class="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100 flex-shrink-0 mr-1">
            <Icon name="solar:play-bold" class="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Logika sapaan otomatis berdasarkan waktu perangkat user secara real-time
const greetingTime = computed(() => {
  const hour = new Date().getHours()
  if (hour < 4) return 'Selamat Malam'
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})
</script>