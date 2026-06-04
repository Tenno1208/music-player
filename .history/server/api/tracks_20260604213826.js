export default defineEventHandler(async () => {
  try {
    const hostResponse = await $fetch('https://api.audius.co')

    const host = hostResponse.data[0]

    const response = await $fetch(
      `${host}/v1/tracks/trending?app_name=NuxtMusic`
    )

    return response
  } catch (err) {
    return {
      data: []
    }
  }
})