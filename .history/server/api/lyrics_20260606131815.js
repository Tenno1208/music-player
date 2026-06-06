export default defineEventHandler(async (event) => {
  const { track_name = '', artist_name = '' } = getQuery(event)

  if (!track_name) {
    return { error: 'Parameter track_name wajib diisi' }
  }

  try {
    // 1. Algoritma Pembersih Super Ketat untuk memisahkan "Artis - Judul" yang sering menyatu di YouTube
    let cleanTrack = track_name
    let cleanArtist = artist_name

    // Jika track_name mengandung tanda "-" atau "–", biasanya formatnya "Artis - Judul"
    if (track_name.includes('-') || track_name.includes('–')) {
      const separator = track_name.includes('-') ? '-' : '–'
      const parts = track_name.split(separator)
      
      // Ambil bagian kiri sebagai artis potensial, bagian kanan sebagai judul
      const potentialArtist = parts[0].trim()
      const potentialTitle = parts[1].trim()

      // Jika channel artist bawaan Youtube terdeteksi berisi nama tim lirik (seperti Indolirik, Lirik Lagu, dll)
      const fakeArtists = ['indolirik', 'lirik', 'lyrics', 'terjemahan', 'music', 'audio', 'vevo', 'official']
      const isFakeArtist = fakeArtists.some(f => artist_name.toLowerCase().includes(f))

      if (isFakeArtist || !artist_name) {
        cleanArtist = potentialArtist
        cleanTrack = potentialTitle
      }
    }

    // Bersihkan sisa simbol aneh dan teks promosi YouTube yang tersisa
    cleanTrack = cleanTrack.replace(/\[[^\]]*\]|\([^)]*\)|official\s*video|lyric\s*video|lyrics|video|lirik|terjemahan|\|.*/gi, '').trim()
    cleanArtist = cleanArtist.replace(/\[[^\]]*\]|\([^)]*\)|-.*|official|lyrics|lirik/gi, '').trim()

    console.log(`🔍 Mencari lirik ke LRCLIB -> Artis: ${cleanArtist} | Judul: ${cleanTrack}`)

    // 2. Tembak langsung ke API Publik Resmi LRCLIB
    const lrclibResponse = await $fetch('https://lrclib.net/api/search', {
      method: 'GET',
      query: {
        track_name: cleanTrack,
        artist_name: cleanArtist
      }
    })

    // 3. Ambil hasil pencarian paling pertama yang paling akurat
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
    console.error('LRCLIB API Fetch Error:', error.message)
    return { syncedLyrics: null, plainLyrics: null, error: error.message }
  }
})