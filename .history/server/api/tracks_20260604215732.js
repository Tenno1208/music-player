export default defineEventHandler(async () => {
  const API_KEY = process.env.YOUTUBE_API_KEY

  const response = await $fetch(
    'https://www.googleapis.com/youtube/v3/search',
    {
      query: {
        part: 'snippet',
        maxResults: 50,
        q: 'music',
        type: 'video',
        videoCategoryId: '10',
        key: API_KEY
      }
    }
  )

  return response
})