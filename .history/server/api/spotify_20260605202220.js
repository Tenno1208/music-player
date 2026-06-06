export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) {
    return { error: 'Query parameter "q" is required' }
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Kredensial SPOTIFY_CLIENT_ID atau SECRET belum diatur di file .env'
    })
  }

  try {
    // 1. Ambil Access Token resmi dengan Header yang bersih
    const tokenResponse = await $fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'NuxtMusicPlayer/1.0'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    })

    const accessToken = tokenResponse?.access_token
    if (!accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Spotify.')
    }

    // 2. Tembak API Search dengan User-Agent agar tidak dicurigai sebagai bot jahat
    const spotifyResponse = await $fetch('https://api.spotify.com/v1/search', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'NuxtMusicPlayer/1.0',
        'Accept': 'application/json'
      },
      query: {
        q: encodeURIComponent(q), // Amankan query string dari karakter aneh/spasi
        type, 
        market: 'ID',
        limit: 10
      }
    })

    return spotifyResponse

  } catch (error) {
    console.error('Detail Error Spotify:', error.data || error.message)
    throw createError({
      statusCode: error.statusCode || 403,
      statusMessage: `Spotify Auth/Search Blocked: ${error.message}`
    })
  }
})