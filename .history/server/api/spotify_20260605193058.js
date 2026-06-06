export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) {
    return { items: [] }
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  try {
    // 1. Dapatkan Access Token dari Spotify (Client Credentials Flow)
    const authOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    }

    const authResponse = await $fetch('https://accounts.spotify.com/api/token', authOptions)
    const accessToken = authResponse.access_token

    // 2. Tembak API Spotify Search menggunakan Access Token tersebut
    const spotifyResponse = await $fetch('https://api.spotify.com/v1/search', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      query: {
        q,
        type, // 'artist' atau 'album'
        market: 'ID',
        limit: 10
      }
    })

    // 3. Standarisasi format data agar seragam saat dikonsumsi Frontend
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
    console.error('Spotify API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Gagal mengambil data dari Spotify API'
    })
  }
})