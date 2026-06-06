export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const track_name = query.track_name || ''
  const artist_name = query.artist_name || ''

  if (!track_name) {
    return { syncedLyrics: null, plainLyrics: null, error: 'track_name is required' }
  }

  try {
    let cleanTrack = track_name
    let cleanArtist = artist_name

    // 1. Ekstraksi format jika judul YouTube menggabungkan "Artis - Judul"
    if (track_name.includes('-') || track_name.includes('–')) {
      const separator = track_name.includes('-') ? '-' : '–'
      const parts = track_name.split(separator)
      
      const potentialArtist = parts[0].trim()
      const potentialTitle = parts[1].trim()

      const fakeArtists = ['indolirik', 'lirik', 'lyrics', 'terjemahan', 'music', 'audio', 'vevo', 'official']
      const isFakeArtist = fakeArtists.some(f => artist_name.toLowerCase().includes(f))

      if (isFakeArtist || !artist_name) {
        cleanArtist = potentialArtist
        cleanTrack = potentialTitle
      }
    }

    // 2. Pembersihan Regex dari teks-teks sampah bawaan YouTube
    cleanTrack = cleanTrack.replace(/\[[^\]]*\]|\([^)]*\)|official\s*video|lyric\s*video|lyrics|lyrics|video|lirik|terjemahan|\|.*/gi, '').trim()
    cleanArtist = cleanArtist.replace(/\[[^\]]*\]|\([^)]*\)|-.*|official|lyrics|lirik/gi, '').trim()

    // 3. Request langsung ke API Publik LRCLIB
    const lrclibResponse = await $fetch('https://lrclib.net/api/search', {
      method: 'GET',
      query: {
        track_name: cleanTrack,
        artist_name: cleanArtist
      }
    })

    // 4. Ambil response index pertama jika liriknya ketemu
    if (lrclibResponse && lrclibResponse.length > 0) {
      const bestMatch = lrclibResponse[0]
      return {
        syncedLyrics: bestMatch.syncedLyrics || null,
        plainLyrics: bestMatch.plainLyrics || null,
        title: bestMatch.trackName,
        artist: bestMatch.artistName
      }
    }

    return { syncedLyrics: null, plainLyrics: null }

  } catch (error) {
    console.error('Gagal mengambil data dari LRCLIB:', error.message)
    return { syncedLyrics: null, plainLyrics: null, error: error.message }
  }
})