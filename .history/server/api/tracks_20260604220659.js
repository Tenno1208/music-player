export default defineEventHandler(async (event) => {
  const API_KEY = process.env.YOUTUBE_API_KEY

  const {
    pageToken = '',
    q = 'official music video'
  } = getQuery(event)

  const response = await $fetch(
    'https://www.googleapis.com/youtube/v3/search',
    {
      query: {
        part: 'snippet',
        q,
        type: 'video',
        maxResults: 20,
        pageToken,
        key: API_KEY
      }
    }
  )

  return response
})