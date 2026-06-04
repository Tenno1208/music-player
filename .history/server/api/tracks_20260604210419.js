// server/api/tracks.js

export default defineEventHandler(async () => {
  const response = await $fetch(
    'https://api.jamendo.com/v3.0/tracks/?client_id=e08f32f7&format=json&limit=20'
  )

  return response
})