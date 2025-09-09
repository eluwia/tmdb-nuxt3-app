export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  const params = new URLSearchParams()
  
  params.append('api_key', config.tmdbApiKey)
  
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  })
  
  const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
  
  try {
    const response = await $fetch(url)
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch discover movies'
    })
  }
})
