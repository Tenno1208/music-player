// stores/player.js
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false
  }),
  actions: {
    playTrack(track) {
      this.currentTrack = track
      this.isPlaying = true
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    }
  }
})