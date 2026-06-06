export default defineEventHandler(async (event) => {
  const { q = '', type = 'artist' } = getQuery(event)

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  const tokenResponse = await $fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId.trim(),
        client_secret: clientSecret.trim()
      })
    }
  )

  const accessToken = tokenResponse.access_token

  return await $fetch(
    'https://api.spotify.com/v1/search',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      query: {
        q,
        type,
        limit: 10,
        market: 'ID'
      }
    }
  )
})