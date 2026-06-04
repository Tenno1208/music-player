// server/api/tracks.js

export default defineEventHandler(async () => {
  const response = await $fetch(
    'https://api.jamendo.com/v3.0/tracks/?client_id=CLIENT_ID_KAMU&format=json&limit=20'
  )

  return response
})