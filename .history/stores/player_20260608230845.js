import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    history: [],
    likedTracks: [], // Menyimpan daftar lagu yang disukai secara global
    
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

    // Aksi untuk menambah atau menghapus lagu dari daftar suka
    toggleLike(track) {
      if (!track) return
      const trackId = track.id?.videoId
      const index = this.likedTracks.findIndex(t => t.id?.videoId === trackId)

      if (index === -1) {
        // Jika belum ada, masukkan ke daftar suka
        this.likedTracks.push(track)
      } else {
        // Jika sudah ada, hapus dari daftar suka
        this.likedTracks.splice(index, 1)
      }
    },

    // Fungsi cek reaktif status suka untuk ikon hati di UI
    isLiked(track) {
      if (!track) return false
      return this.likedTracks.some(t => t.id?.videoId === track.id?.videoId)
    }
  }
})