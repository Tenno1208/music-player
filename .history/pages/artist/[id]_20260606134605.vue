<template>
  <div class="min-h-screen bg-[#121212] text-white p-6 md:p-10">
    <!-- Tombol Kembali -->
    <button @click="$router.back()" class="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
      <Icon name="solar:alt-arrow-left-bold" class="w-6 h-6" />
      <span class="font-bold">Kembali</span>
    </button>

    <!-- Header Profil Artis -->
    <div class="flex flex-col md:flex-row gap-8 items-start mb-12">
      <div class="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/5">
        <img :src="artistData?.image" class="w-full h-full object-cover" :alt="artistData?.name" />
      </div>
      <div class="flex flex-col justify-center mt-4">
        <h1 class="text-5xl font-black mb-2">{{ artistData?.name || 'Loading...' }}</h1>
        <p class="text-zinc-400 font-medium">Profil Artis Spotify Terverifikasi</p>
        <div class="mt-4 flex gap-3">
          <button class="bg-rose-500 hover:bg-rose-600 px-6 py-2 rounded-full font-bold transition-transform active:scale-95">
            Ikuti
          </button>
          <button class="border border-white/20 hover:bg-white/10 px-6 py-2 rounded-full font-bold transition-all">
            Bagikan
          </button>
        </div>
      </div>
    </div>

    <!-- Daftar Lagu -->
    <div>
      <h2 class="text-2xl font-black mb-6">Lagu Terpopuler</h2>
      <div class="space-y-2">
        <div 
          v-for="(track, index) in artistData?.topTracks" 
          :key="index"
          class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <span class="text-zinc-500 font-bold w-6">{{ index + 1 }}</span>
          <img :src="track.albumCover" class="w-12 h-12 rounded-lg object-cover" />
          <div class="flex-1">
            <p class="font-bold text-white">{{ track.title }}</p>
            <p class="text-zinc-400 text-sm">{{ artistData?.name }}</p>
          </div>
          <Icon name="solar:play-bold" class="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const artistId = route.params.id

// Di sini Anda bisa memanggil API backend Anda untuk mengambil data detail 
// berdasarkan ID yang ada di route.params.id
const artistData = ref({
  name: 'Hindia',
  image: 'https://i.scdn.co/image/ab6761610000e5ebb786cb6de7505caff17fe11f',
  topTracks: [
    { title: 'Evaluasi', albumCover: 'https://i.scdn.co/image/ab6761610000e5ebb786cb6de7505caff17fe11f' },
    { title: 'Secukupnya', albumCover: 'https://i.scdn.co/image/ab6761610000e5ebb786cb6de7505caff17fe11f' }
  ]
})

// Gunakan useFetch untuk mengambil data real dari API backend Anda
// const { data } = await useFetch(`/api/artist/${artistId}`)
</script>