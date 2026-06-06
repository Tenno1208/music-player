export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  if (!q) return { items: [] }

  try {
    // Tembak ke iTunes Search API yang gratis, tanpa token, tanpa login premium
    const itunesResponse = await $fetch('https://itunes.apple.com/search', {
      method: 'GET',
      query: {
        term: q.trim(),
        country: 'ID',
        media: 'music',
        entity: type === 'artist' ? 'musicArtist' : 'album',
        limit: type === 'artist' ? 1 : 8
      }
    })

    const results = itunesResponse.results || []

    if (type === 'artist') {
      return {
        items: results.map((artist) => ({
          name: artist.artistName,
          description: 'Artist',
          // Karena iTunes tidak menyediakan foto profil lingkaran musisi secara publik,
          // Kita pakai visual placeholder estetik bertema hitam/gelap agar serasi dengan Montera Red
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=400&fit=crop',
          isArtist: true
        }))
      }
    } else if (type === 'album') {
      return {
        items: results.map((album) => {
          // Mengubah resolusi cover album iTunes dari 100x100 menjadi 600x600 HD murni
          const hdImage = album.artworkUrl100 ? album.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400'
          
          return {
            name: album.collectionName || album.trackName,
            description: album.artistName,
            image: hdImage,
            isArtist: false
          }
        })
      }
    }

    return { items: [] }

  } catch (error) {
    console.error('iTunes API Error:', error.message)
    return { items: [] }
  }
})