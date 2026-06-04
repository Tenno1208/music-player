export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Mengambil API KEY dari env Nuxt (bisa juga via process.env)
  const API_KEY = config.youtubeApiKey || process.env.YOUTUBE_API_KEY

  const { pageToken = '', q = '' } = getQuery(event)

  // Gabungkan query pencarian pengguna dengan filter agar memunculkan musik resmi
  const searchQuery = q ? `${q} official music` : 'official music video trending'

  try {
    const response = await $fetch(
      'https://www.googleapis.com/youtube/v3/search',
      {
        query: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          videoCategoryId: '10', // Kategori khusus musik di YouTube
          maxResults: 12, // Ambil 12 dulu untuk grid awal yang rapi, bisa dinaikkan jika mau
          pageToken,
          key: API_KEY
        }
      }
    )
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memuat data dari YouTube API'
    })
  }
})