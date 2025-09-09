export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  
  const url = 'https://api.themoviedb.org/3/genre/movie/list'
  const params = new URLSearchParams({
    api_key: config.tmdbApiKey
  })
  
  try {
    const response = await $fetch(`${url}?${params}`)
    return response
  } catch (error) {
    console.error('Genre API - Error:', error instanceof Error ? error.message : String(error))
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch movie genres'
    })
  }
})
