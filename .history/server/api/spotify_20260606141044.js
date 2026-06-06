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
    // Ambil Access Token
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

    // Cari Artist
    const searchResult = await $fetch(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        query: {
          q: q.trim(),
          type: 'artist',
          market: 'ID',
          limit: 1
        }
      }
    )

    const artist = searchResult?.artists?.items?.[0]

    if (!artist) {
      return null
    }

    const artistDetail = await $fetch(
  `https://api.spotify.com/v1/artists/${artist.id}`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
)

console.log('========================')
console.log('ARTIST DETAIL')
console.log(JSON.stringify(artistDetail, null, 2))
console.log('========================')

    // Top Tracks Artist
    // Top Tracks Artist
let topTracks = []

try {
  const tracksResponse = await $fetch(
    `https://api.spotify.com/v1/artists/${artist.id}/top-tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      query: {
        market: 'ID'
      }
    }
  )

  console.log('========================')
  console.log('ARTIST ID:', artist.id)
  console.log('ARTIST NAME:', artist.name)
  console.log('TRACK RESPONSE:')
  console.log(JSON.stringify(tracksResponse, null, 2))
  console.log('========================')

  topTracks = (tracksResponse?.tracks || []).map(track => ({
    id: track.id,
    title: track.name,
    albumCover: track.album?.images?.[0]?.url || '',
    previewUrl: track.preview_url,
    durationMs: track.duration_ms,
    spotifyUrl: track.external_urls?.spotify
  }))
} catch (err) {
  console.error('========================')
  console.error('TOP TRACKS ERROR')
  console.error(err)
  console.error(err?.data)
  console.error('========================')
}

    return {
      id: artistDetail.id,
      name: artistDetail.name,
      popularity: artistDetail.popularity,
      followers: artistDetail.followers?.total || 0,
      genres: artistDetail.genres || [],
      image: artistDetail.images?.[0]?.url || '',
      spotifyUrl: artistDetail.external_urls?.spotify,
      topTracks
    }

  } catch (error) {
    console.error('Spotify Error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Spotify API Error'
    })
  }
})