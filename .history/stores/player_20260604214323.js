import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false
  }),

  actions: {
    playTrack(track) {
      this.currentTrack = {
        ...track,
        stream_url: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=NuxtMusic`
      }

      this.isPlaying = true
    },

    togglePlay() {
      this.isPlaying = !this.isPlaying
    }
  }
})