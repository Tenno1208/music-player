export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) {
    return { error: 'Query parameter "q" is required' }
  }

  // Mengambil data kredensial dari file .env kamu yang sudah benar
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  try {
    // 1. Dapatkan Access Token langsung dari URL Resmi Server Accounts Spotify
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

    // 2. Tembak ke URL Resmi Spotify Web API Search
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

    // 3. Kembalikan response asli
    return spotifyResponse

  } catch (error) {
    console.error('Spotify API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Gagal mengambil data murni dari Spotify API resmi'
    })
  }
})