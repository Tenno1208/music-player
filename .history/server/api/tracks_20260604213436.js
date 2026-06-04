export default defineEventHandler(async () => {
  const response = await $fetch(
    'https://discoveryprovider.audius.co/v1/tracks/trending?app_name=NuxtMusic'
  )

  return response
})