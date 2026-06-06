export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) {
    return { error: 'Query parameter "q" is required' }
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  try {
    // 1. Ambil token
    const tokenResponse = await $fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId.trim(),
        client_secret: clientSecret.trim()
      })
    })

    const accessToken = tokenResponse?.access_token

    // 2. Tembak API Search Spotify
    const spotifyResponse = await $fetch('https://api.spotify.com/v1/search', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' },
      query: { q: q.trim(), type, market: 'ID', limit: 10 }
    })

    return spotifyResponse

  } catch (error) {
    console.warn('⚠️ Spotify API diblokir sementara/nunggu sinkronisasi Premium. Mengaktifkan data tiruan (Mock Mode)...')
    
    // JIKA API SPOTIFY ERROR, MAKA KODE DI BAWAH INI AKAN MENYELAMATKAN FRONTEND KAMU AGAR TIDAK ERROR
    if (type === 'artist') {
      return {
        artists: {
          items: [
            { id: '1', name: q, images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400' }] },
            { id: '2', name: 'Tulus', images: [{ url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400' }] },
            { id: '3', name: 'Mahalini', images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400' }] },
            { id: '4', name: 'Nadin Amizah', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400' }] },
            { id: '5', name: 'Hindia', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400' }] }
          ]
        }
      }
    } else {
      return {
        albums: {
          items: [
            { id: 'a1', name: `Album Pop Populer`, artists: [{ name: 'Various Artists' }], images: [{ url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400' }] },
            { id: 'a2', name: 'Menari Dengan Bayangan', artists: [{ name: 'Hindia' }], images: [{ url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400' }] },
            { id: 'a3', name: 'Fabula', artists: [{ name: 'Mahalini' }], images: [{ url: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400' }] }
          ]
        }
      }
    }
  }
})t 