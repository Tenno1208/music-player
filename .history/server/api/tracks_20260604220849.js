export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const API_KEY = process.env.YOUTUBE_API_KEY // Atau config.youtubeApiKey jika diset di nuxt.config

  // Ambil query parameter q dan pageToken dari request frontend
  const { q = 'official music video', pageToken = '' } = getQuery(event)

  try {
    const response = await $fetch(
      'https://www.googleapis.com/youtube/v3/search',
      {
        query: {
          part: 'snippet',
          q: q || 'official music video', // Fallback kalau search kosong
          type: 'video',
          maxResults: 12, // Diubah ke 12 atau 20 agar load awal tidak terlalu berat & bagus di grid layout
          pageToken,
          key: API_KEY
        }
      }
    )
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data dari YouTube API'
    })
  }
})