// Pencarian serbaguna Deezer — gratis, TANPA API key
// GET /api/search?q=<query>&index=<offset>&limit=<n>
const DEEZER = 'https://api.deezer.com'

// cache manual per query (10 menit) — aman untuk semua versi Nuxt
const cache = new Map()
const TTL = 10 * 60 * 1000

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

const mapArtist = (a) => ({
  id: a.id,
  name: a.name,
  image: a.picture_medium || a.picture_big || '',
  fans: a.nb_fan || 0,
  deezerUrl: a.link || ''
})

const mapAlbum = (al) => ({
  id: al.id,
  name: al.title || '',
  artistId: al.artists?.[0]?.id || '',
  artistName: al.artists?.[0]?.name || '',
  image: al.cover_medium || al.cover_big || ''
})

export default defineEventHandler(async (event) => {
  const q = String(getQuery(event).q || '').trim()
  const index = Math.max(parseInt(getQuery(event).index) || 0, 0)
  const limit = Math.min(parseInt(getQuery(event).limit) || 24, 50)

  if (!q) {
    return { q, total: 0, hasMore: false, tracks: [], artists: [], albums: [] }
  }

  const cacheKey = `${q}|${index}|${limit}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < TTL) return cached.data

  const [trackRes, artistRes, albumRes] = await Promise.all([
    $fetch(`${DEEZER}/search/track`, { query: { q, index, limit } }),
    // artis & album cukup dihalaman pertama saja (hemat request)
    index === 0 ? $fetch(`${DEEZER}/search/artist`, { query: { q, limit: 12 } }) : Promise.resolve(null),
    index === 0 ? $fetch(`${DEEZER}/search/album`, { query: { q, limit: 12 } }) : Promise.resolve(null)
  ])

  if (trackRes?.error) {
    throw createError({ statusCode: 502, statusMessage: 'Deezer search error' })
  }

  const total = trackRes?.total || 0
  const data = {
    q,
    total,
    hasMore: index + (trackRes?.data?.length || 0) < total,
    tracks: (trackRes?.data || []).map(mapTrack),
    artists: (artistRes?.data || []).map(mapArtist),
    albums: (albumRes?.data || []).map(mapAlbum)
  }

  cache.set(cacheKey, { ts: Date.now(), data })
  if (cache.size > 200) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0]
    if (oldest) cache.delete(oldest[0])
  }
  return data
})