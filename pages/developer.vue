<template>
  <div class="px-6 py-10 max-w-4xl mx-auto">
    <div class="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm">
      <div class="absolute top-0 right-0 p-32 bg-rose-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div class="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-rose-500/30 overflow-hidden flex-shrink-0 shadow-2xl">
          <img src="https://avatars.githubusercontent.com/u/100000000?v=4" alt="Developer Profile" class="w-full h-full object-cover bg-zinc-800" onerror="this.src='https://i.pravatar.cc/300?img=11'" />
        </div>
        
        <div class="text-center md:text-left flex-1">
          <div class="inline-block px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-full mb-3 border border-rose-500/20">
            Lead Developer
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">John Doe</h1>
          <p class="text-xl text-zinc-400 font-medium mb-6">Full Stack Engineer & UI/UX Enthusiast</p>
          
          <p class="text-zinc-300 leading-relaxed mb-8 max-w-2xl">
            Passionate about building highly interactive and aesthetic web applications. 
            This Nuxt Music Player (MonteraRed) was built to demonstrate modern UI patterns, 
            responsive design, and seamless YouTube API integration wrapped in a Spotify-like premium aesthetic.
          </p>

          <div class="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="#" class="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full text-white font-medium transition-colors border border-white/5">
              <Icon name="mdi:github" class="w-5 h-5" />
              GitHub
            </a>
            <a href="#" class="flex items-center gap-2 bg-[#0a66c2] hover:bg-[#084e96] px-5 py-2.5 rounded-full text-white font-medium transition-colors">
              <Icon name="mdi:linkedin" class="w-5 h-5" />
              LinkedIn
            </a>
            <a href="mailto:hello@example.com" class="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 px-5 py-2.5 rounded-full text-white font-medium transition-colors shadow-lg shadow-rose-600/30">
              <Icon name="solar:letter-bold" class="w-5 h-5" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="mt-12">
      <h3 class="text-xl font-bold text-white mb-6">Technologies Used</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div class="bg-[#181818] border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <Icon name="logos:nuxt-icon" class="w-8 h-8" />
          <span class="text-sm font-bold text-white">Nuxt 3</span>
        </div>
        <div class="bg-[#181818] border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <Icon name="logos:vue" class="w-8 h-8" />
          <span class="text-sm font-bold text-white">Vue 3</span>
        </div>
        <div class="bg-[#181818] border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <Icon name="logos:tailwindcss-icon" class="w-8 h-8" />
          <span class="text-sm font-bold text-white">Tailwind CSS</span>
        </div>
        <div class="bg-[#181818] border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <Icon name="logos:pinia" class="w-8 h-8" />
          <span class="text-sm font-bold text-white">Pinia</span>
        </div>
        <div class="bg-[#181818] border border-white/5 p-4 rounded-xl flex items-center gap-3">
          <Icon name="logos:youtube-icon" class="w-8 h-8" />
          <span class="text-sm font-bold text-white">YouTube API</span>
        </div>
      </div>
    </div>
  </div>
</template>
