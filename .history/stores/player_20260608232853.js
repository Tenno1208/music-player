import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    history: [],
    likedTracks: [],
    isShuffle: true,
    isRepeat: false, // Menambahkan state reaktif untuk tombol ulangi lagu
    isModalOpen: false,
    currentTime: 0,
    duration: 0,
    seekRequest: null
  }),

  actions: {
    playTrack(track) {
      this.currentTrack = track
      this.isPlaying = true
      
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
      this.currentTime = seconds
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

    toggleRepeat() {
      this.isRepeat = !this.isRepeat
    },

    // 🚀 LOGIKA STRATEGIS PUTAR ULANG / ACAK
    playNextTrack() {
      if (!this.currentTrack) return

      // 1. JIKA MODE REPEAT AKTIF: Putar ulang lagu yang sama dari awal
      if (this.isRepeat) {
        console.log('Mode Repeat Aktif. Mengulang lagu:', this.currentTrack.snippet?.title)
        this.seekTo(0)
        this.isPlaying = true
        return
      }

      // 2. JIKA MODE SHUFFLE AKTIF: Cari lagu acak dari riwayat dengar
      if (this.isShuffle) {
        const otherTracks = this.history.filter(t => t.id?.videoId !== this.currentTrack?.id?.videoId)

        if (otherTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherTracks.length)
          const nextTrack = otherTracks[randomIndex]
          console.log('Memutar lagu acak berikutnya:', nextTrack.snippet?.title)
          this.playTrack(nextTrack)
        } else {
          // Jika tidak ada lagu lain di riwayat, ulangi lagu saat ini
          this.seekTo(0)
          this.isPlaying = true
        }
      }
    }
  }
})