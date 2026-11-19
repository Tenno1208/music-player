const DEEZER = 'https://api.deezer.com'

const mapTrack = (t) => ({
  id: t.id,
  title: t.title,
  artist: t.artist?.name || '',
  artistId: t.artist?.id || null,
  artistImage: t.artist?.picture_medium || t.artist?.picture_big || '',
  album: t.album?.title || '',
  albumId: t.album?.id || null,
  albumCover: t.album?.cover_medium || t.album?.cover_big || '',
  previewUrl: t.preview || null,
  durationMs: (t.duration || 0) * 1000,
  deezerUrl: t.link || '',
  spotifyUrl: t.link || '' // kompatibilitas frontend lama
})

const mapArtist = (a) => ({
  id: a.id,
  name: a.name,
  image: a.picture_medium || a.picture_big || '',
  fans: a.nb_fan || 0,
  albums: a.nb_album || 0,
  deezerUrl: a.link || ''
})

export default defineCachedEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '').trim()
  const nameParam = String(getQuery(event).name || '')
  if (!id) return { error: 'Parameter "id" wajib diisi' }

  try {
    // ===== Genre resmi Deezer (id angka, contoh: /genre/132) =====
    if (/^\d+$/.test(id)) {
      const [genre, chart, artists] = await Promise.all([
        $fetch(`${DEEZER}/genre/${id}`),
        $fetch(`${DEEZER}/chart/${id}/tracks`, { query: { limit: 30 } }),
        $fetch(`${DEEZER}/genre/${id}/artists`, { query: { limit: 12 } })
      ])

      if (genre?.error) throw new Error('Genre tidak ditemukan')

      return {
        id: genre.id,
        name: genre.name,
        type: 'deezer',
        image: genre.picture_xl || genre.picture_big || '',
        tracks: (chart?.data || []).map(mapTrack),
        artists: (artists?.data || []).map(mapArtist)
      }
    }

    // ===== Kategori pencarian (slug, contoh: /genre/dangdut) =====
    const q = id.replace(/-/g, ' ')
    const [trackRes, artistRes] = await Promise.all([
      $fetch(`${DEEZER}/search/track`, { query: { q, limit: 30 } }),
      $fetch(`${DEEZER}/search/artist`, { query: { q, limit: 12 } })
    ])

    return {
      id,
      name: nameParam || q.replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'search',
      query: q,
      image: trackRes?.data?.[0]?.album?.cover_big || artistRes?.data?.[0]?.picture_big || '',
      tracks: (trackRes?.data || []).map(mapTrack),
      artists: (artistRes?.data || []).map(mapArtist)
    }
  } catch (error) {
    console.error('GENRE ERROR:', error?.message || error)
    return { error: true, message: error?.message || 'Gagal memuat genre' }
  }
}, {
  name: 'deezer-genre',
  maxAge: 60 * 60, // cache 1 jam per genre
  getKey: (event) => String(getRouterParam(event, 'id'))
})