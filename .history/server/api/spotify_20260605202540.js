export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) {
    return { error: 'Query parameter "q" is required' }
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  try {
    // 1. Ambil token TANPA menggunakan Basic Auth Base64 (Kirim langsung di Body)
    // Cara ini jauh lebih kebal dari error spasi tersembunyi di file .env
    const tokenResponse = await $fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId.trim(),       // .trim() untuk menghapus spasi gaib
        client_secret: clientSecret.trim() // .trim() untuk menghapus spasi gaib
      })
    })

    const accessToken = tokenResponse?.access_token
    if (!accessToken) {
      throw new Error('Gagal mengekstrak Access Token.')
    }

    // 2. Tembak ke API Search Resmi Spotify
    const spotifyResponse = await $fetch('https://api.spotify.com/v1/search', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      query: {
        q: q.trim(),
        type, 
        market: 'ID',
        limit: 10
      }
    })

    return spotifyResponse

  } catch (error) {
    // Memunculkan pesan di terminal backend
    console.error('--- DETAIL ERROR ---', error.data)
    
    throw createError({
      statusCode: error.statusCode || 403,
      statusMessage: 'Spotify Gateway Blocked',
      data: error.data // Menampilkan detail alasan di browser kamu
    })
  }
})