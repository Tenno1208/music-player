// server/api/spotify.js
// Sumber: Deezer Public API (utama) + iTunes Search API (fallback)
// 100% gratis, TANPA API key / token

const DEEZER = 'https://api.deezer.com'
const ITUNES = 'https://itunes.apple.com'

// hapus duplikat + batasi jumlah lagu
const dedupeAndSlice = (tracks, max = 50) =>
  [...new Map(tracks.map(item => [item.id, item])).values()].slice(0, max)

async function fetchFromDeezer(q) {
  try {
    // 1. SEARCH ARTIST
    const search = await $fetch(`${DEEZER}/search/artist`, {
      query: { q, limit: 1 }
    })

    // Deezer kadang mengembalikan error dengan status 200 (misal kuota habis)
    if (search?.error || !search?.data?.length) return null

    const artist = search.data[0]

    // 2. DETAIL ARTIST
    const artistDetail = await $fetch(`${DEEZER}/artist/${artist.id}`)
    if (artistDetail?.error) return null

    // 3. ALBUM ARTIST (mirip include_groups: 'album,single')
    const albumsResponse = await $fetch(`${DEEZER}/artist/${artist.id}/albums`, {
      query: { limit: 10 }
    })
    if (albumsResponse?.error) return null

    const albums = (albumsResponse.data || []).filter(a =>
      ['album', 'single'].includes(a.record_type)
    )

    let topTracks = []
    const genres = new Set()

    // 4. LOOP SEMUA ALBUM → AMBIL TRACK
    for (const album of albums) {
      try {
        const albumDetail = await $fetch(`${DEEZER}/album/${album.id}`)

        for (const g of albumDetail.genres?.data || []) {
          if (g?.name) genres.add(g.name)
        }

        const tracks = (albumDetail.tracks?.data || []).map(track => ({
          id: track.id,
          title: track.title,
          album: albumDetail.title || album.title,
          albumId: album.id,
          albumCover: albumDetail.cover_xl || album.cover_medium || '',
          previewUrl: track.preview || null, // MP3 preview 30 detik
          durationMs: (track.duration || 0) * 1000,
          // key "spotifyUrl" dipertahankan agar frontend lama tidak perlu diubah
          spotifyUrl: track.link || `https://www.deezer.com/track/${track.id}`,
          deezerUrl: track.link || `https://www.deezer.com/track/${track.id}`
        }))

        topTracks.push(...tracks)
      } catch (err) {
        console.error('DEEZER ALBUM ERROR:', album.title)
      }
    }

    topTracks = dedupeAndSlice(topTracks)
    if (!topTracks.length) return null // biar jatuh ke fallback

    return {
      source: 'deezer',
      id: artistDetail.id,
      name: artistDetail.name,
      popularity: null, // Deezer tidak punya skor popularity
      followers: artistDetail.nb_fan || 0,
      genres: [...genres],
      image: artistDetail.picture_xl || artistDetail.picture_big || '',
      spotifyUrl: artistDetail.link || '',
      deezerUrl: artistDetail.link || '',
      topTracks
    }
  } catch (err) {
    console.error('DEEZER ERROR:', err?.message || err)
    return null
  }
}

async function fetchFromItunes(q) {
  try {
    // 1. SEARCH ARTIST
    const search = await $fetch(`${ITUNES}/search`, {
      query: { term: q, entity: 'musicArtist', limit: 1, country: 'ID' }
    })

    const artist = search?.results?.[0]
    if (!artist) return null

    // 2. ALBUM ARTIST (lookup sekalian memberi detail artis)
    const albumsRes = await $fetch(`${ITUNES}/lookup`, {
      query: { id: artist.artistId, entity: 'album', limit: 10, country: 'ID' }
    })

    const albums = (albumsRes?.results || []).filter(
      r => r.wrapperType === 'collection'
    )

    let topTracks = []
    const genres = new Set()

    // 3. TRACK TIAP ALBUM
    for (const album of albums) {
      try {
        if (album.primaryGenreName) genres.add(album.primaryGenreName)

        const detail = await $fetch(`${ITUNES}/lookup`, {
          query: { id: album.collectionId, entity: 'song', limit: 200, country: 'ID' }
        })

        const tracks = (detail?.results || [])
          .filter(r => r.wrapperType === 'track')
          .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))
          .map(track => ({
            id: track.trackId,
            title: track.trackName,
            album: track.collectionName || album.collectionName,
            albumId: track.collectionId,
            albumCover: (track.artworkUrl100 || album.artworkUrl100 || '').replace(
              '100x100',
              '600x600'
            ),
            previewUrl: track.previewUrl || null, // M4A preview 30 detik
            durationMs: track.trackTimeMillis || 0,
            spotifyUrl: track.trackViewUrl || '' // kompatibilitas (link Apple Music)
          }))

        topTracks.push(...tracks)
      } catch (err) {
        console.error('ITUNES ALBUM ERROR:', album.collectionName)
      }
    }

    topTracks = dedupeAndSlice(topTracks)
    if (!topTracks.length) return null

    return {
      source: 'itunes',
      id: artist.artistId,
      name: artist.artistName,
      popularity: null,
      followers: null,
      genres: [...genres],
      image: (albums[0]?.artworkUrl100 || '').replace('100x100', '600x600'),
      spotifyUrl: artist.artistLinkUrl || '',
      itunesUrl: artist.artistLinkUrl || '',
      topTracks
    }
  } catch (err) {
    console.error('ITUNES ERROR:', err?.message || err)
    return null
  }
}

export default defineEventHandler(async (event) => {
  const { q = '' } = getQuery(event)

  if (!q) {
    return { error: 'Query parameter "q" is required' }
  }

  const itunes = await fetchFromItunes(q)
  if (itunes) return itunes

  return { error: 'Artist not found' }
})