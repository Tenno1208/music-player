import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    history: [],
    likedTracks: [], // Menyimpan daftar lagu yang disukai secara global
    queue: [], // Tambahkan atau pastikan ada array antrean lagu saat ini
    isShuffle: false,
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
    }}

playNextTrack() {
      // 1. Jika mode acak (shuffle) aktif dan ada riwayat/antrean lagu
      if (this.isShuffle && this.history.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.history.length)
        const randomTrack = this.history[randomIndex]
        this.playTrack(randomTrack)
        return
      }

      // 2. Jika ada antrean lagu (queue) selanjutnya
      if (this.queue && this.queue.length > 0) {
        const nextTrack = this.queue.shift() // Ambil lagu pertama dari antrean
        this.playTrack(nextTrack)
        return
      }

      // 3. Fallback/Alternatif: Jika antrean habis, putar lagu acak dari riwayat putar (history) Anda
      if (this.history.length > 1) {
        // Cari lagu di history yang ID-nya tidak sama dengan lagu yang baru saja selesai
        const otherTracks = this.history.filter(t => t.id?.videoId !== this.currentTrack?.id?.videoId)
        if (otherTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherTracks.length)
          this.playTrack(otherTracks[randomIndex])
        }
      }
    },

    // Action pembantu untuk menyalakan/mematikan mode acak dari UI
    toggleShuffle() {
      this.isShuffle = !this.isShuffle
    }
  }
})