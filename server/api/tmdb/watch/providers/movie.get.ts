export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const url = 'https://api.themoviedb.org/3/watch/providers/movie'
  const params = new URLSearchParams({
    api_key: config.tmdbApiKey,
    watch_region: query.watch_region || 'US'
  })
  
  try {
    const response = await $fetch(`${url}?${params}`)
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch movie watch providers'
    })
  }
})
