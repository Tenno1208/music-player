import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    history: [],
    queue: [],
    likedTracks: [],
    isShuffle: true,
    isRepeat: false,
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

    setQueue(tracks) {
      this.queue = tracks
    },

   playNextTrack() {
  console.log('Queue:', this.queue)

  const otherTracks = this.queue.filter(
    t => t.id?.videoId !== this.currentTrack?.id?.videoId
  )

  console.log('Other tracks:', otherTracks)

  if (otherTracks.length === 0) return

  const randomIndex = Math.floor(
    Math.random() * otherTracks.length
  )

  this.playTrack(otherTracks[randomIndex])
}
  }
})