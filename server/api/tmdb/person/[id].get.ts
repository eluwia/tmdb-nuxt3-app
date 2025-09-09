export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  
  const apiKey = config.tmdbApiKey || process.env.NUXT_TMDB_API_KEY || '348088421ad3fb3a9d6e56bb6a9a8f80'
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key not configured'
    })
  }
  
  const url = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&append_to_response=combined_credits`
  
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
      statusMessage: `Failed to fetch person details: ${error.message}`
    })
  }
})