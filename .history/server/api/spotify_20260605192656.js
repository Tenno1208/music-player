export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) return { items: [] }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  try {
    // Gunakan URLSearchParams murni untuk memastikan format form-urlencoded sempurna
    const tokenParams = new URLSearchParams()
    tokenParams.append('grant_type', 'client_credentials')
    tokenParams.append('client_id', clientId)
    tokenParams.append('client_secret', clientSecret)

    // Request token tanpa basic auth header (bisa langsung melempar ID & Secret di body)
    const authResponse = await $fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenParams.toString()
    }).catch((err) => {
      console.error(' [Spotify Auth Error]:', err.data || err.message)
      throw err
    })

    const accessToken = authResponse.access_token

    // Tembak pencarian ke Spotify
    const spotifyResponse = await $fetch('https://api.spotify.com/v1/search', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      query: {
        q: q.trim(),
        type,
        limit: type === 'artist' ? 1 : 8
      }
    }).catch((err) => {
      console.error(' [Spotify Search Error]:', err.data || err.message)
      throw err
    })

    // Mapping Data untuk Frontend
    if (type === 'artist') {
      const artists = spotifyResponse.artists?.items || []
      return {
        items: artists.map((artist) => ({
          name: artist.name,
          description: 'Artist',
          image: artist.images[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200',
          isArtist: true
        }))
      }
    } else if (type === 'album') {
      const albums = spotifyResponse.albums?.items || []
      return {
        items: albums.map((album) => ({
          name: album.name,
          description: album.artists.map((a) => a.name).join(', '),
          image: album.images[0]?.url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200',
          isArtist: false
        }))
      }
    }

    return { items: [] }

  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Forbidden / Access Denied'
    })
  }
})