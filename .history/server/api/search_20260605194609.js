export default defineEventHandler(async (event) => {
  // Tangkap query q dan pageToken dari request frontend
  const { q, pageToken = '' } = getQuery(event)

  try {
    const data = await $fetch(
      'https://www.googleapis.com/youtube/v3/search',
      {
        query: {
          part: 'snippet',
          maxResults: 20,
          q: q || 'top hits indonesia', // fallback kata kunci jika q kosong
          type: 'video',
          pageToken: pageToken, // Meneruskan token navigasi halaman dari frontend
          key: process.env.YOUTUBE_API_KEY
        }
      }
    )

    return data
  } catch (error) {
    console.error('YouTube API Search Backend Error:', error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Gagal mencari lagu dari platform YouTube API'
    })
  }
})