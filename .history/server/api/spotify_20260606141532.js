export default defineEventHandler(async (event) => {
  const { q = '' } = getQuery(event)

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

  const searchResult = await $fetch(
    'https://api.spotify.com/v1/search',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      query: {
        q,
        type: 'artist',
        limit: 1
      }
    }
  )

  const artist = searchResult?.artists?.items?.[0]

  if (!artist) {
    return {
      error: 'Artist not found'
    }
  }

  let artistDetail = null
  let topTracks = null
  let topTracksError = null

  try {
    artistDetail = await $fetch(
      `https://api.spotify.com/v1/artists/${artist.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
  } catch (err) {
    artistDetail = err?.data || err
  }

  try {
    topTracks = await $fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        query: {
          market: 'ID'
        }
      }
    )
  } catch (err) {
    topTracksError = {
      statusCode: err?.statusCode,
      data: err?.data,
      message: err?.message
    }
  }

  return {
    searchResult,
    artistDetail,
    topTracks,
    topTracksError
  }
})