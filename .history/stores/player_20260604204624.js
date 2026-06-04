// stores/player.ts
import { defineStore } from 'pinia'

interface Track {
  id: string
  name: string
  artist_name: string
  audio: string
  cover: string
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null as Track | null,
    isPlaying: false,
    audioInstance: null as HTMLAudioElement | null,
    progress: 0,
    duration: 0
  }),
  actions: {
    playTrack(track: Track) {
      // Jika ada lagu yang sedang berputar, hentikan terlebih dahulu
      if (this.audioInstance) {
        this.audioInstance.pause()
        this.audioInstance.src = ''
      }

      this.currentTrack = track
      this.isPlaying = true

      // Membuat objek HTML5 Audio baru dengan link stream dari API Bridge
      this.audioInstance = new Audio(track.audio)
      this.audioInstance.play()

      // Sinkronisasi data durasi dan progress bar secara realtime
      this.audioInstance.ontimeupdate = () => {
        if (this.audioInstance) {
          this.progress = this.audioInstance.currentTime
          this.duration = this.audioInstance.duration || 0
        }
      }

      // Handle otomatis ketika lagu berakhir
      this.audioInstance.onended = () => {
        this.isPlaying = false
        this.progress = 0
      }
    },
    togglePlay() {
      if (!this.audioInstance) return

      if (this.isPlaying) {
        this.audioInstance.pause()
        this.isPlaying = false
      } else {
        this.audioInstance.play()
        this.isPlaying = true
      }
    },
    seek(time: number) {
      if (!this.audioInstance) return
      this.audioInstance.currentTime = time
      this.progress = time
    }
  },
  getters: {
    formatTime: () => (time: number) => {
      const mins = Math.floor(time / 60)
      const secs = Math.floor(time % 60)
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }
  }
})