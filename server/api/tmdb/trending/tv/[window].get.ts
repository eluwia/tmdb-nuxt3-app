export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const window = getRouterParam(event, 'window')
  const query = getQuery(event)
  
  const apiKey = config.tmdbApiKey || process.env.NUXT_TMDB_API_KEY || '348088421ad3fb3a9d6e56bb6a9a8f80'
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key not configured'
    })
  }
  
  const url = `https://api.themoviedb.org/3/trending/tv/${window}?api_key=${apiKey}&page=${query.page || 1}`
  
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
      statusMessage: `Failed to fetch trending TV shows: ${error.message}`
    })
  }
})