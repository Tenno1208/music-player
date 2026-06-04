export default defineEventHandler(async (event) => {
  const API_KEY = process.env.YOUTUBE_API_KEY

  const { pageToken = '' } = getQuery(event)

  const response = await $fetch(
    'https://www.googleapis.com/youtube/v3/search',
    {
      query: {
        part: 'snippet',
        q: 'official music video',
        type: 'video',
        maxResults: 50,
        pageToken,
        key: API_KEY
      }
    }
  )

  return response
})