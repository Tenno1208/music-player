export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) {
    return { items: [] }
  }

  // Menggunakan runtimeConfig atau process.env
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  // Cek jika kredensial kosong
  if (!clientId || !clientSecret) {
    console.error(' [Spotify Error] Client ID atau Client Secret belum diatur di .env!')
    throw createError({
      statusCode: 500,
      statusMessage: 'Kredensial Spotify belum dikonfigurasi di file .env'
    })
  }

  try {
    // 1. Dapatkan Access Token dengan format string body yang lebih aman
    const base64Auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    const authResponse = await $fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials' // Pakai string murni agar menghindari isu parsing objek
    }).catch((err) => {
      console.error(' [Spotify Auth Error] Gagal dapet token:', err.data || err.message)
      throw err
    })

    const accessToken = authResponse.access_token

    // 2. Tembak API Spotify Search menggunakan Access Token tersebut
    const spotifyResponse = await $fetch('https://api.spotify.com/v1/search', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      query: {
        q: q.trim(), // Membersihkan spasi liar di ujung kata
        type: type,  // 'artist' atau 'album'
        market: 'ID',
        limit: type === 'artist' ? 1 : 8 // Kalau nyari artis eceran cukup ambil 1 yang paling pas, kalau album ambil 8
      }
    }).catch((err) => {
      console.error(' [Spotify Search Error] Detail:', err.data || err.message)
      throw err
    })

    // 3. Standarisasi format data untuk Frontend
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
      statusMessage: error.statusMessage || 'Gagal mengambil data dari Spotify API'
    })
  }
})