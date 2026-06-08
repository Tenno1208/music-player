import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    history: [],
    likedTracks: [],
    isShuffle: true, // Kita nyalakan mode acak (shuffle) secara default
    isModalOpen: false,
    currentTime: 0,
    duration: 0,
    seekRequest: null
  }),

  actions: {
    playTrack(track) {
      this.currentTrack = track
      this.isPlaying = true
      
      // Menambahkan ke riwayat putar di baris paling atas (tanpa duplikasi)
      if (this.history.length === 0 || this.history[0].id?.videoId !== track.id?.videoId) {
        this.history = [track, ...this.history.filter(t => t.id?.videoId !== track.id?.videoId)]
      }
    },

    togglePlay() {
      this.isPlaying = !this.isPlaying
    },

    toggleModal() {
      this.isModalOpen = !this.isModalOpen
    },

    updateProgress(currentTime, duration) {
      this.currentTime = currentTime
      this.duration = duration
    },

    seekTo(seconds) {
      this.seekRequest = seconds
      this.currentTime = seconds // optimistic update
    },

    toggleLike(track) {
      if (!track) return
      const trackId = track.id?.videoId
      const index = this.likedTracks.findIndex(t => t.id?.videoId === trackId)

      if (index === -1) {
        this.likedTracks.push(track)
      } else {
        this.likedTracks.splice(index, 1)
      }
    },

    isLiked(track) {
      if (!track) return false
      return this.likedTracks.some(t => t.id?.videoId === track.id?.videoId)
    },

    toggleShuffle() {
      this.isShuffle = !this.isShuffle
    },

    // 🚀 ACTION OTOMATIS: Dipicu saat lagu selesai diputar
    playNextTrack() {
      if (!this.currentTrack) return

      // Cari semua kandidat lagu lain di riwayat (history) selain lagu yang baru saja selesai
      const otherTracks = this.history.filter(t => t.id?.videoId !== this.currentTrack?.id?.videoId)

      if (otherTracks.length > 0) {
        // Ambil satu lagu secara acak dari riwayat dengar Anda sebelumnya
        const randomIndex = Math.floor(Math.random() * otherTracks.length)
        const nextTrack = otherTracks[randomIndex]
        
        console.log('Memutar lagu acak berikutnya:', nextTrack.snippet?.title)
        this.playTrack(nextTrack)
      } else {
        console.log('Tidak ada lagu lain di riwayat untuk diacak.')
      }
    }
  }
})