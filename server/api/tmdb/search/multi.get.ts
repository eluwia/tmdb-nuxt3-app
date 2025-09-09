export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const apiKey = config.tmdbApiKey || process.env.NUXT_TMDB_API_KEY || '348088421ad3fb3a9d6e56bb6a9a8f80'
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key not configured'
    })
  }
  
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query.query}&page=${query.page || 1}&include_adult=false`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `TMDB request failed: ${response.status}`
      })
    }
    return await response.json()
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to search: ${error.message}`
    })
  }
})
