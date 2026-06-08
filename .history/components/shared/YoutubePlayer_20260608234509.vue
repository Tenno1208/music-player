<script setup>
import { onMounted, watch } from 'vue'
import { usePlayerStore } from '~/stores/player'

const playerStore = usePlayerStore()
let ytPlayer = null
let progressInterval = null

const loadYoutubeApi = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }
    
    // Setup global callback
    window.onYouTubeIframeAPIReady = () => {
      resolve()
    }
    
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  })
}

onMounted(async () => {
  await loadYoutubeApi()
  
  ytPlayer = new window.YT.Player('global-youtube-player', {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      modestbranding: 1
    },
    events: {
      onReady: (event) => {
        if (playerStore.currentTrack) {
          ytPlayer.loadVideoById(playerStore.currentTrack.id.videoId)
        }
      },
      onStateChange: (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
          playerStore.isPlaying = true
          startProgressInterval()
        } else if (event.data === window.YT.PlayerState.PAUSED) {
          playerStore.isPlaying = false
          stopProgressInterval()
        else if (event.data === window.YT.PlayerState.ENDED) {
  playerStore.isPlaying = false
  stopProgressInterval()

  console.log('VIDEO SELESAI')

  if (playerStore.isRepeat) {
    ytPlayer.seekTo(0)
    ytPlayer.playVideo()
    return
  }

  playerStore.playNextTrack()
}
      }
    }
  })
})

const startProgressInterval = () => {
  stopProgressInterval()
  progressInterval = setInterval(() => {
    if (ytPlayer && ytPlayer.getCurrentTime && typeof ytPlayer.getCurrentTime === 'function') {
      const currentTime = ytPlayer.getCurrentTime()
      const duration = ytPlayer.getDuration()
      if (duration > 0) {
        playerStore.updateProgress(currentTime, duration)
      }
    }
  }, 500)
}

const stopProgressInterval = () => {
  if (progressInterval) clearInterval(progressInterval)
}

// Watchers to control the player from store state
watch(() => playerStore.currentTrack, (newTrack) => {
  if (ytPlayer && typeof ytPlayer.loadVideoById === 'function' && newTrack) {
    ytPlayer.loadVideoById(newTrack.id.videoId)
  }
})

watch(() => playerStore.isPlaying, (isPlaying) => {
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    if (isPlaying) ytPlayer.playVideo()
    else ytPlayer.pauseVideo()
  }
})

watch(() => playerStore.seekRequest, (newTime) => {
  if (newTime !== null && ytPlayer && typeof ytPlayer.seekTo === 'function') {
    ytPlayer.seekTo(newTime, true)
    playerStore.seekRequest = null
  }
})
</script>

<template>
  <div class="fixed opacity-0 pointer-events-none w-0 h-0 z-[-1]">
    <div id="global-youtube-player"></div>
  </div>
</template>
