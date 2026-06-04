export default defineEventHandler(async () => {
  const response = await $fetch(
    'https://api.jamendo.com/v3.0/tracks/?client_id=&format=json&limit=50&order=popularity_total'
  )

  return response
})