<template>
  <div class="px-4 sm:px-8 py-8 max-w-5xl mx-auto space-y-10 select-none">
    
    <!-- Profile Hero Card -->
    <div class="relative rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] p-6 sm:p-12 overflow-hidden shadow-2xl">
      <!-- Ambient light -->
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/10 blur-[100px] pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        
        <!-- Profile Picture with Subtle Ring -->
        <div class="relative flex-shrink-0 group">
          <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl p-1 bg-white/[0.02]">
            <img
              src="https://i.pravatar.cc/300?img=33"
              alt="Developer Avatar"
              class="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <span class="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#111116]" title="Aktif"></span>
        </div>

        <!-- Details -->
        <div class="flex-1 text-center md:text-left space-y-3 min-w-0">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-zinc-300">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Software Engineer & Interface Designer</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Avvatar
          </h1>

          <p class="text-xs sm:text-sm text-zinc-400 font-medium max-w-2xl leading-relaxed">
            Berfokus pada pengembangan arsitektur web modern dengan keutamaan estetika visual minimalis, performa latensi rendah, dan pengalaman audio yang mulus.
          </p>

          <p class="text-xs text-zinc-500 max-w-2xl leading-relaxed">
            Aplikasi <span class="text-zinc-200 font-semibold">Noizy</span> dirancang sebagai pemutar audio studio-grade yang menggabungkan basis data lagu YouTube, metadata Spotify, serta sinkronisasi lirik lrc berbasis waktu nyata.
          </p>

          <!-- Links -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white border border-white/[0.06] transition-all"
            >
              <Icon name="mdi:github" class="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white border border-white/[0.06] transition-all"
            >
              <Icon name="mdi:linkedin" class="w-4 h-4 text-[#0a66c2]" />
              <span>LinkedIn</span>
            </a>

            <a
              href="mailto:contact@example.com"
              class="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-600/20 transition-all"
            >
              <Icon name="solar:letter-linear" class="w-4 h-4" />
              <span>Hubungi Saya</span>
            </a>
          </div>

        </div>

      </div>
    </div>

    <!-- Technology & Architecture Stack -->
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">
          Arsitektur Teknologi
        </h2>
        <span class="text-xs text-zinc-500 font-medium">Modern Tech Stack</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        
        <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center group hover:border-white/[0.1] transition-all">
          <Icon name="logos:nuxt-icon" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-semibold text-zinc-300 group-hover:text-white">Nuxt 3</span>
          <span class="text-[10px] text-zinc-500">Framework</span>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center group hover:border-white/[0.1] transition-all">
          <Icon name="logos:vue" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-semibold text-zinc-300 group-hover:text-white">Vue 3</span>
          <span class="text-[10px] text-zinc-500">Reactivity</span>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center group hover:border-white/[0.1] transition-all">
          <Icon name="logos:tailwindcss-icon" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-semibold text-zinc-300 group-hover:text-white">Tailwind CSS</span>
          <span class="text-[10px] text-zinc-500">Design System</span>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center group hover:border-white/[0.1] transition-all">
          <Icon name="logos:pinia" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-semibold text-zinc-300 group-hover:text-white">Pinia</span>
          <span class="text-[10px] text-zinc-500">State Store</span>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center group hover:border-white/[0.1] transition-all">
          <Icon name="logos:youtube-icon" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-semibold text-zinc-300 group-hover:text-white">YouTube API</span>
          <span class="text-[10px] text-zinc-500">Audio Stream</span>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center group hover:border-white/[0.1] transition-all">
          <Icon name="logos:spotify-icon" class="w-7 h-7 filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span class="text-xs font-semibold text-zinc-300 group-hover:text-white">Spotify API</span>
          <span class="text-[10px] text-zinc-500">Metadata Sync</span>
        </div>

      </div>
    </div>

  </div>
</template>
