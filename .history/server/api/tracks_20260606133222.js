export default defineEventHandler(async (event) => {
  const API_KEY = process.env.YOUTUBE_API_KEY

  // Ambil query parameter q dan pageToken dari request frontend
  const { q = 'official music video', pageToken = '' } = getQuery(event)

  if (!API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Kredensial YOUTUBE_API_KEY tidak ditemukan di file .env'
    })
  }

  try {
    const response = await $fetch(
      'https://www.googleapis.com/youtube/v3/search',
      {
        query: {
          part: 'snippet',
          q: q || 'official music video',
          type: 'video',
          maxResults: 12,
          pageToken,
          key: API_KEY.trim() // .trim() buat ngehapus spasi gaib di .env jika ada
        }
      }
    )
    
    // Kembalikan response sukses asli dari YouTube
    return response
  } catch (error) {
    // TAMPILKAN ERROR ASLI DARI GOOGLE / YOUTUBE SERVER
    console.error('===== YOUTUBE API ERROR BONGKAR =====')
    console.error('Detail Error Google:', error.data || error.message)
    console.error('=====================================')

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Gagal mengambil data dari YouTube API',
      // Kirim objek data error asli dari Google ke frontend kamu
      data: error.data 
    })
  }
})