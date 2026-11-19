// Artis pilihan + album pilihan + tangga lagu untuk beranda
// Sumber: Deezer Public API — gratis, TANPA API key
const DEEZER = 'https://api.deezer.com'

// daftar artis yang ditonjolkan di beranda
const FEATURED_ARTISTS = ['Tulus', 'Mahalini', 'Nadin Amizah', 'Hindia', 'Rizky Febian', 'Tiara Andini']

const fmtFans = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + ' JT'
  if (n >= 1e3) return Math.round(n / 1e3) + ' RB'
  return String(n || 0)
}

// bentuk track sama seperti endpoint /api/spotify dulu — player store tidak perlu diubah
const mapTrack = (t) => ({
  id: t.id,
  title: t.title,
  artist: t.artist?.name || '',
  artistId: t.artist?.id || null,
  artistImage: t.artist?.picture_medium || '',
  album: t.album?.title || '',
  albumId: t.album?.id || null,
  albumCover: t.album?.cover_medium || t.album?.cover_big || '',
  previewUrl: t.preview || null, // MP3 preview 30 detik
  durationMs: (t.duration || 0) * 1000,
  deezerUrl: t.link || '',
  spotifyUrl: t.link || '' // kompatibilitas frontend lama
})

const mapAlbum = (al) => ({
  id: al.id,
  name: al.title, // di Deezer nama album = "title"
  artistId: al.artists?.[0]?.id || '',
  artistName: al.artists?.[0]?.name || 'Various Artists',
  description: al.artists?.map((x) => x.name).join(', ') || 'Various Artists',
  image: al.cover_medium || al.cover_big || ''
})

const mapArtist = (a, fallbackName) => ({
  id: a.id,
  name: a.name || fallbackName,
  description: `${fmtFans(a.nb_fan)} fans`,
  image: a.picture_big || a.picture_medium || ''
})

const dedupe = (list, keyFn) => [...new Map(list.map((x) => [keyFn(x), x])).values()]

export default defineCachedEventHandler(async () => {
  try {
    const [artistResults, albumsRes, tracksRes] = await Promise.all([
      Promise.all(
        FEATURED_ARTISTS.map((name) =>
          $fetch(`${DEEZER}/search/artist`, { query: { q: name, limit: 1 } })
        )
      ),
      $fetch(`${DEEZER}/search/album`, { query: { q: 'pop indonesia', limit: 12 } }),
      $fetch(`${DEEZER}/search/track`, { query: { q: 'hits indonesia', limit: 25 } })
    ])

    const artists = artistResults
      .map((res, i) => (res?.data?.[0] ? mapArtist(res.data[0], FEATURED_ARTISTS[i]) : null))
      .filter(Boolean)

    let tracks = dedupe((tracksRes?.data || []).map(mapTrack), (t) => t.id)

    // cadangan: kalau pencarian kosong, pakai chart global Deezer
    if (!tracks.length) {
      try {
        const chart = await $fetch(`${DEEZER}/chart/0/tracks`, { query: { limit: 20 } })
        tracks = dedupe((chart?.data || []).map(mapTrack), (t) => t.id)
      } catch (err) { /* abaikan */ }
    }

    return {
      source: 'deezer',
      artists,
      albums: dedupe((albumsRes?.data || []).map(mapAlbum), (a) => a.id).slice(0, 10),
      tracks: tracks.slice(0, 15)
    }
  } catch (error) {
    console.error('HOME ERROR:', error?.message || error)
    return { error: true, artists: [], albums: [], tracks: [] }
  }
}, { name: 'home-catalog', maxAge: 60 * 60 }) // cache 1 jam di server