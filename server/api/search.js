export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)

  const data = await $fetch(
    'https://www.googleapis.com/youtube/v3/search',
    {
      query: {
        part: 'snippet',
        maxResults: 20,
        q,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY
      }
    }
  )

  return data
})