import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Player store — engine: YouTube IFrame Player API (lagu penuh, gratis, tanpa API key).
 *
 * Strategi:
 *  - videoId YouTube dicari lewat endpoint server /api/youtube-search (Piped/Invidious).
 *  - video YouTube di-hidden (1x1 px di luar layar); UI menampilkan cover sendiri.
 *  - kalau videoId tidak ketemu → fallback ke HTML5 Audio pakai track.previewUrl
 *    (preview Deezer 30 dtk), biar setidaknya tetap bunyi.
 *
 * API publik sengaja dipertahankan sama persis dengan store lama (HTML5 Audio),
 * jadi komponen/halaman yang sudah ada tidak perlu diubah.
 */
export const usePlayerStore = defineStore('player', () => {
  /* ===== state ===== */
  const queue = ref([])
  const currentIndex = ref(-1)
  const currentTrack = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.8)
  const muted = ref(false)
  const shuffle = ref(false)
  const repeat = ref('off') // 'off' | 'all' | 'one'

  /* ===== lagu favorit (persist ke localStorage) ===== */
  const LIKED_KEY = 'music-player-liked'
  const likedTracks = ref([])
  if (import.meta.client) {
    try { likedTracks.value = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') } catch (e) { likedTracks.value = [] }
  }

  /* ===== engine internal (non-reactive, module-scoped per store instance) ===== */
  let engine = null            // 'youtube' | 'audio' | null → engine aktif sekarang
  let currentVideoId = null    // videoId yang sedang/akan dimainkan (cache biar togglePlay nggak search ulang)
  let loadToken = 0            // anti-race: hanya load terbaru yang boleh apply hasilnya

  // --- YouTube IFrame ---
  let ytReady = false          // window.YT.Player sudah terdefinisi?
  let ytPlayerReady = false    // instance YT.Player sudah onReady?
  let ytPlayer = null          // instance YT.Player
  let ytHostReady = false      // elemen host <div id="yt-audio-host"> sudah ada di DOM?
  let pending = null           // { track, autoplay } menunggu YT siap
  let pollTimer = null         // interval polling currentTime/duration YouTube

  // --- Fallback HTML5 Audio (preview 30 dtk) ---
  let audio = null

  /* ---------- YouTube: load script + buat hidden player ---------- */
  const ensureYt = () => {
    if (!import.meta.client) return
    if (window.YT && window.YT.Player) { ytReady = true; ensureYtPlayer(); return }
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'yt-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true
      document.head.appendChild(tag)
    }
    // YouTube IFrame API akan memanggil window.onYouTubeIframeAPIReady() saat siap.
    if (typeof window.onYouTubeIframeAPIReady !== 'function') {
      window.onYouTubeIframeAPIReady = () => { ytReady = true; ensureYtPlayer() }
    }
  }

  const ensureYtPlayer = () => {
    if (!ytReady || ytPlayer || !import.meta.client) return
    if (!ytHostReady) {
      let host = document.getElementById('yt-audio-host')
      if (!host) {
        host = document.createElement('div')
        host.id = 'yt-audio-host'
        host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;'
        host.innerHTML = '<div id="yt-audio-player"></div>'
        document.body.appendChild(host)
      }
      ytHostReady = true
    }
    ytPlayer = new window.YT.Player('yt-audio-player', {
      height: '1',
      width: '1',
      videoId: '',
      playerVars: {
        autoplay: 0, controls: 0, disablekb: 1, fs: 0,
        modestbranding: 1, rel: 0, playsinline: 1, iv_load_policy: 3
      },
      events: {
        onReady: () => {
          ytPlayerReady = true
          try {
            ytPlayer.setVolume(Math.round(volume.value * 100))
            if (muted.value) ytPlayer.mute()
          } catch (e) {}
          if (pending) {
            const p = pending
            pending = null
            load(p.track, p.autoplay)
          }
        },
        onStateChange: (e) => {
          const S = window.YT.PlayerState
          if (e.data === S.PLAYING) { isPlaying.value = true; startPoll() }
          else if (e.data === S.PAUSED) { isPlaying.value = false; stopPoll() }
          else if (e.data === S.ENDED) { stopPoll(); onEnded() }
          // BUFFERING / CUED / UNSTARTED: biarkan apa adanya
        },
        onError: () => { isPlaying.value = false }
      }
    })
  }

  /* ---------- polling currentTime/duration YouTube ---------- */
  const startPoll = () => {
    if (pollTimer || !import.meta.client) return
    pollTimer = setInterval(() => {
      if (!ytPlayer || engine !== 'youtube') return
      try {
        const t = ytPlayer.getCurrentTime?.() || 0
        const d = ytPlayer.getDuration?.() || 0
        currentTime.value = t
        if (d) duration.value = d   // durasi asli video (lagu penuh), overwrite estimasi durationMs
      } catch (e) {}
    }, 500)
  }
  const stopPoll = () => {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  }

  /* ---------- fallback: HTML5 Audio (preview Deezer 30 dtk) ---------- */
  const ensureAudio = () => {
    if (!import.meta.client || audio) return
    audio = new Audio()
    audio.volume = volume.value
    audio.muted = muted.value
    audio.addEventListener('timeupdate', () => { currentTime.value = audio.currentTime || 0 })
    audio.addEventListener('loadedmetadata', () => { duration.value = audio.duration || 0 })
    audio.addEventListener('ended', () => onEnded())
    audio.addEventListener('play', () => { isPlaying.value = true })
    audio.addEventListener('pause', () => { isPlaying.value = false })
    audio.addEventListener('error', () => { isPlaying.value = false })
  }

  const stopAllEngines = () => {
    stopPoll()
    try { ytPlayer?.pauseVideo?.() } catch (e) {}
    try { audio?.pause() } catch (e) {}
  }

  /* ---------- cari videoId YouTube via server (dipakai bila track belum punya youtubeId) ---------- */
  const resolveVideoId = async (track) => {
    if (!track) return null
    if (track.youtubeId) return track.youtubeId

    // kalau previewUrl ternyata URL YouTube, ambil id-nya langsung
    if (typeof track.previewUrl === 'string' && /youtube\.com|youtu\.be/.test(track.previewUrl)) {
      const m = track.previewUrl.match(/(?:v=|youtu\.be\/)([\w-]{11})/)
      if (m) { track.youtubeId = m[1]; return m[1] }
    }

    if (!import.meta.client) return null
    try {
      const q = `${track.artist || ''} ${track.title || ''}`.trim()
      if (!q) return null
      const res = await $fetch('/api/youtube-search', { query: { q } })
      if (res?.videoId) { track.youtubeId = res.videoId; return res.videoId } // cache ke track biar nggak search ulang
    } catch (e) {}
    return null
  }

  const onEnded = () => {
    if (repeat.value === 'one') {
      if (engine === 'youtube' && ytPlayer) {
        try { ytPlayer.seekTo(0, true); ytPlayer.playVideo() } catch (e) {}
      } else if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
      return
    }
    next()
  }

  /* ---------- load utama ---------- */
  const load = async (track, autoplay = true) => {
    const myToken = ++loadToken   // anti-race: invalidate load lama
    currentTrack.value = track
    currentTime.value = 0
    duration.value = (track?.durationMs || 0) / 1000  // estimasi awal; akan di-overwrite saat audio/video siap

    if (!import.meta.client) return

    // 1) coba YouTube (lagu penuh)
    ensureYt()
    if (!ytPlayerReady) { pending = { track, autoplay }; return }

    stopAllEngines()
    const videoId = await resolveVideoId(track)
    if (myToken !== loadToken) return  // ada load yang lebih baru, abaikan

    if (videoId) {
      engine = 'youtube'
      currentVideoId = videoId
      try {
        if (autoplay) ytPlayer.loadVideoById(videoId)  // load + play
        else ytPlayer.cueVideoById(videoId)            // load tanpa play
      } catch (e) { isPlaying.value = false }
      return
    }

    // 2) fallback: HTML5 Audio (preview Deezer 30 dtk) — minimal tetap bunyi
    if (track?.previewUrl) {
      ensureAudio()
      engine = 'audio'
      audio.src = track.previewUrl
      audio.load()
      if (autoplay) audio.play().catch(() => { isPlaying.value = false })
      return
    }

    // 3) benar-benar tidak bisa diputar
    engine = null
    currentVideoId = null
    isPlaying.value = false
  }

  /* ===== API publik (nama tetap sama → komponen lama tetap jalan) ===== */

  // isi queue saja (panggil playTrack setelahnya) — dipakai: setQueue(tracks)
  const setQueue = (tracks = []) => {
    queue.value = [...(tracks || [])]
  }

  // putar track; kalau diberi list kedua, queue ikut diganti
  const playTrack = (track, list = null) => {
    if (!track) return
    if (list?.length) {
      queue.value = [...list]
      currentIndex.value = Math.max(list.findIndex((t) => t.id === track.id), 0)
    } else {
      const i = queue.value.findIndex((t) => t.id === track.id)
      if (i >= 0) {
        currentIndex.value = i
      } else {
        queue.value.push(track)
        currentIndex.value = queue.value.length - 1
      }
    }
    load(track, true)
  }

  const pause = () => {
    if (pending) { pending.autoplay = false; return }  // YT belum siap: tandai jangan autoplay nanti
    if (engine === 'youtube') try { ytPlayer?.pauseVideo?.() } catch (e) {}
    else if (audio) audio.pause()
  }

  const togglePlay = () => {
    if (!currentTrack.value) {
      if (queue.value.length) return playTrack(queue.value[0])
      return
    }
    if (pending) { pending.autoplay = !pending.autoplay; return }
    if (engine === 'youtube') {
      if (isPlaying.value) try { ytPlayer.pauseVideo() } catch (e) {}
      else if (currentVideoId) try { ytPlayer.playVideo() } catch (e) {}
      else load(currentTrack.value, true)
    } else if (engine === 'audio' || (audio && audio.src)) {
      if (isPlaying.value) audio.pause()
      else {
        if (!audio.src && currentTrack.value?.previewUrl) { audio.src = currentTrack.value.previewUrl; audio.load() }
        audio.play().catch(() => {})
      }
    } else {
      load(currentTrack.value, true)
    }
  }

  const stop = () => {
    pending = null
    stopAllEngines()
    try { ytPlayer?.stopVideo?.() } catch (e) {}
    if (audio) { audio.pause(); audio.currentTime = 0 }
    isPlaying.value = false
  }

  const next = () => {
    if (!queue.value.length) return
    let i
    if (shuffle.value && queue.value.length > 1) {
      i = Math.floor(Math.random() * queue.value.length)
      if (i === currentIndex.value) i = (i + 1) % queue.value.length
    } else {
      i = currentIndex.value + 1
    }
    if (i >= queue.value.length) {
      if (repeat.value === 'all') i = 0
      else { stop(); return }
    }
    currentIndex.value = i
    load(queue.value[i], true)
  }

  const previous = () => {
    const t = engine === 'audio'
      ? (audio?.currentTime || 0)
      : (() => { try { return ytPlayer?.getCurrentTime?.() || 0 } catch (e) { return 0 } })()
    if (t > 3) {
      if (engine === 'youtube') try { ytPlayer.seekTo(0, true) } catch (e) {}
      else if (audio) audio.currentTime = 0
      return
    }
    if (!queue.value.length) return
    let i = currentIndex.value - 1
    if (i < 0) {
      if (repeat.value === 'all') i = queue.value.length - 1
      else return
    }
    currentIndex.value = i
    load(queue.value[i], true)
  }

  const seek = (t) => {
    if (engine === 'youtube') try { ytPlayer.seekTo(t, true) } catch (e) {}
    else if (audio) audio.currentTime = t
    currentTime.value = t
  }

  const setVolume = (v) => {
    volume.value = Math.min(Math.max(v, 0), 1)
    if (engine === 'youtube') try { ytPlayer.setVolume(Math.round(volume.value * 100)) } catch (e) {}
    if (audio) audio.volume = volume.value
  }

  const toggleMute = () => {
    muted.value = !muted.value
    if (engine === 'youtube') try { muted.value ? ytPlayer.mute() : ytPlayer.unMute() } catch (e) {}
    if (audio) audio.muted = muted.value
  }

  const toggleShuffle = () => { shuffle.value = !shuffle.value }
  const cycleRepeat = () => {
    repeat.value = repeat.value === 'off' ? 'all' : repeat.value === 'all' ? 'one' : 'off'
  }

  /* ===== like ===== */
  const persistLiked = () => {
    if (import.meta.client) {
      try { localStorage.setItem(LIKED_KEY, JSON.stringify(likedTracks.value)) } catch (e) {}
    }
  }
  const toggleLike = (track) => {
    if (!track) return
    const i = likedTracks.value.findIndex((t) => t.id === track.id)
    if (i >= 0) likedTracks.value.splice(i, 1)
    else likedTracks.value.unshift(track)
    persistLiked()
  }
  const isLiked = (track) => !!track && likedTracks.value.some((t) => t.id === track.id)

  // alias agar komponen lama yang membaca player.current tetap aman
  const current = currentTrack

  return {
    queue, currentIndex, currentTrack, current,
    isPlaying, currentTime, duration,
    volume, muted, shuffle, repeat,
    likedTracks,
    setQueue, playTrack, pause, togglePlay, stop,
    next, previous, seek,
    setVolume, toggleMute, toggleShuffle, cycleRepeat,
    toggleLike, isLiked
  }
})