export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const { q, page = 1 } = query
  
  if (!q) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter "q" is required'
    })
  }
  
  const url = 'https://api.themoviedb.org/3/search/multi'
  const params = new URLSearchParams({
    api_key: config.tmdbApiKey,
    query: q,
    page: page.toString(),
    include_adult: 'false'
  })
  
  try {
    const response = await $fetch(`${url}?${params}`)
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search'
    })
  }
})
