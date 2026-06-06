export default defineEventHandler(async (event) => {
  const { q = '' } = getQuery(event)

  if (!q) {
    return {
      error: 'Query parameter "q" is required'
    }
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  try {
    // TOKEN
    const tokenResponse = await $fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId.trim(),
          client_secret: clientSecret.trim()
        })
      }
    )

    const accessToken = tokenResponse.access_token

    if (!accessToken) {
      throw new Error('Access token tidak ditemukan')
    }

    // SEARCH ARTIST
    const searchResult = await $fetch(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        query: {
          q,
          type: 'artist',
          limit: 1
        }
      }
    )

    const artist = searchResult?.artists?.items?.[0]

    if (!artist) {
      return {
        error: 'Artist not found'
      }
    }

    // DETAIL ARTIST
    const artistDetail = await $fetch(
      `https://api.spotify.com/v1/artists/${artist.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    // ALBUM ARTIST
    const albumsResponse = await $fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/albums`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        query: {
          include_groups: 'album,single',
          market: 'ID',
          limit: 10
        }
      }
    )

    let topTracks = []

    // LOOP SEMUA ALBUM
    for (const album of albumsResponse.items || []) {
      try {
        const albumDetail = await $fetch(
          `https://api.spotify.com/v1/albums/${album.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )

        const tracks = (albumDetail.tracks?.items || []).map(track => ({
          id: track.id,
          title: track.name,
          album: album.name,
          albumId: album.id,
          albumCover: album.images?.[0]?.url || '',
          spotifyUrl:
            track.external_urls?.spotify ||
            `https://open.spotify.com/track/${track.id}`,
          previewUrl: track.preview_url || null,
          durationMs: track.duration_ms || 0
        }))

        topTracks.push(...tracks)
      } catch (err) {
        console.error('ALBUM ERROR:', album.name)
      }
    }

    // HAPUS DUPLIKAT
    topTracks = [
      ...new Map(
        topTracks.map(item => [item.id, item])
      ).values()
    ]

    // BATASI 50 LAGU
    topTracks = topTracks.slice(0, 50)

    return {
      id: artistDetail.id,
      name: artistDetail.name,
      popularity: artistDetail.popularity || 0,
      followers: artistDetail.followers?.total || 0,
      genres: artistDetail.genres || [],
      image: artistDetail.images?.[0]?.url || '',
      spotifyUrl: artistDetail.external_urls?.spotify || '',
      topTracks
    }

  } catch (error) {
    console.error('SPOTIFY ERROR:', error)

    return {
      error: true,
      statusCode: error?.statusCode || 500,
      message: error?.message,
      data: error?.data
    }
  }
})