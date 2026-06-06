export default defineEventHandler(async (event) => {
  const { q = '' } = getQuery(event)

  if (!q) {
    return {
      error: 'Query parameter "q" is required'
    }
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  try {
    // ACCESS TOKEN
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

    console.log('TOKEN RESPONSE')
    console.log(JSON.stringify(tokenResponse, null, 2))

    const accessToken = tokenResponse.access_token

    // SEARCH ARTIST
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

    // DETAIL ARTIST
    let artistDetail = null
    let artistDetailError = null

    try {
      artistDetail = await $fetch(
        `https://api.spotify.com/v1/artists/${artist.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      console.log('ARTIST DETAIL')
      console.log(JSON.stringify(artistDetail, null, 2))
    } catch (err) {
      artistDetailError = {
        statusCode: err?.statusCode,
        data: err?.data,
        message: err?.message
      }
    }

    // ALBUMS
    let albums = null
    let albumsError = null

    try {
      albums = await $fetch(
        `https://api.spotify.com/v1/artists/${artist.id}/albums`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          query: {
            include_groups: 'album,single',
            market: 'ID',
            limit: 10
          }
        }
      )

      console.log('ALBUMS')
      console.log(JSON.stringify(albums, null, 2))
    } catch (err) {
      albumsError = {
        statusCode: err?.statusCode,
        data: err?.data,
        message: err?.message
      }
    }

    // TOP TRACKS
    let topTracks = null
    let topTracksError = null

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

      console.log('TOP TRACKS')
      console.log(JSON.stringify(topTracks, null, 2))
    } catch (err) {
      topTracksError = {
        statusCode: err?.statusCode,
        data: err?.data,
        message: err?.message
      }
    }

    return {
      tokenResponse,
      searchResult,
      artistDetail,
      artistDetailError,
      albums,
      albumsError,
      topTracks,
      topTracksError
    }

  } catch (error) {
    console.error(error)

    return {
      error: true,
      statusCode: error?.statusCode,
      message: error?.message,
      data: error?.data
    }
  }
})