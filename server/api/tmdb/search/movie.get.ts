export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const url = 'https://api.themoviedb.org/3/search/movie'
  const params = new URLSearchParams({
    api_key: config.tmdbApiKey,
    query: String(query.q || ''),
    page: String(query.page || '1'),
    include_adult: 'false'
  })
  
  try {
    const response = await $fetch(`${url}?${params}`)
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search movies'
    })
  }
})
