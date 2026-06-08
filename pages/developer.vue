<template>
  <div class="px-4 sm:px-6 py-8 md:py-12 max-w-4xl mx-auto text-zinc-100 selection:bg-rose-600 selection:text-white">
    
    <!-- Kartu Utama Profil Developer -->
    <div class="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-6 sm:p-10 relative overflow-hidden backdrop-blur-md shadow-2xl">
      <!-- Ornamen Cahaya Latar Belakang (Ambient Glow Merah Noizy) -->
      <div class="absolute -top-20 -right-20 p-40 bg-rose-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-20 p-40 bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
        
        <!-- Frame Foto Profil (Avvatar Disinkronkan dengan Topbar) -->
        <div class="relative group flex-shrink-0">
          <!-- Efek Border Berpendar -->
          <div class="absolute -inset-1 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
          
          <div class="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full border-2 border-white/10 overflow-hidden shadow-2xl bg-zinc-900">
            <img 
              src="https://i.pravatar.cc/300?img=33" 
              alt="MonteraRed Avvatar" 
              class="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" 
            />
          </div>
        </div>
        
        <!-- Info Detail & Deskripsi Diri -->
        <div class="text-center md:text-left flex-1 min-w-0">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-black rounded-md mb-3 border border-rose-500/20 uppercase tracking-wider">
            <Icon name="solar:star-bold" class="w-3.5 h-3.5 animate-pulse" />
            <span>Lead Developer</span>
          </div>
          
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
            Avvatar
          </h1>
          
          <p class="text-base sm:text-lg text-zinc-400 font-bold mb-5 tracking-wide">
            Full Stack Engineer & UI/UX Enthusiast
          </p>
          
          <p class="text-zinc-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-medium">
            Fokus pada pengembangan aplikasi web interaktif dengan estetika visual yang tinggi. 
            Platform Pemutar Musik <span class="text-white font-black">Noizy</span> ini dibangun menggunakan pola arsitektur UI modern, tata letak yang sepenuhnya responsif di semua perangkat, serta integrasi pemutar cerdas yang mulus tanpa iklan.
          </p>

          <!-- Daftar Tautan Sosial Media -->
          <div class="flex flex-wrap gap-3 justify-center md:justify-start">
            <a href="#" class="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition border border-white/5 active:scale-95">
              <Icon name="mdi:github" class="w-4 h-4 text-zinc-400 group-hover:text-white" />
              GitHub
            </a>
            <a href="#" class="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition border border-white/5 active:scale-95">
              <Icon name="mdi:linkedin" class="w-4 h-4 text-[#0a66c2]" />
              LinkedIn
            </a>
            <a href="mailto:hello@example.com" class="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 px-5 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-600/20 active:scale-95">
              <Icon name="solar:letter-bold" class="w-4 h-4" />
              Hubungi Saya
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- Bagian Tech Stack Premium Grid -->
    <div class="mt-12">
      <div class="flex items-center gap-2 border-b border-white/5 pb-3 mb-6">
        <Icon name="solar:code-circle-bold-duotone" class="w-5 h-5 text-rose-500" />
        <h3 class="text-base font-black uppercase tracking-wider text-zinc-300">Teknologi Utama</h3>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <!-- Nuxt 3 -->
        <div class="bg-[#16161a] border border-white/5 hover:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-colors group cursor-default">
          <Icon name="logos:nuxt-icon" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-black text-zinc-400 group-hover:text-white transition-colors">Nuxt 3</span>
        </div>
        <!-- Vue 3 -->
        <div class="bg-[#16161a] border border-white/5 hover:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-colors group cursor-default">
          <Icon name="logos:vue" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-black text-zinc-400 group-hover:text-white transition-colors">Vue 3</span>
        </div>
        <!-- Tailwind -->
        <div class="bg-[#16161a] border border-white/5 hover:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-colors group cursor-default">
          <Icon name="logos:tailwindcss-icon" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-black text-zinc-400 group-hover:text-white transition-colors">Tailwind CSS</span>
        </div>
        <!-- Pinia -->
        <div class="bg-[#16161a] border border-white/5 hover:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-colors group cursor-default">
          <Icon name="logos:pinia" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-black text-zinc-400 group-hover:text-white transition-colors">Pinia</span>
        </div>
        <!-- YouTube API -->
        <div class="bg-[#16161a] border border-white/5 hover:border-white/10 p-4 rounded-xl flex items-center gap-3 transition-colors group cursor-default">
          <Icon name="logos:youtube-icon" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-black text-zinc-400 group-hover:text-white transition-colors">YouTube API</span>
        </div>
      </div>
    </div>

  </div>
</template>