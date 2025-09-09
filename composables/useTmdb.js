export const useTmdb = () => {
  const config = useRuntimeConfig()
  
  const posterUrl = (path, size = 'w342') => {
    if (!path) return '/placeholder-movie.jpg'
    return `${config.public.imgBase}/${size}${path}`
  }
  
  const backdropUrl = (path, size = 'w1280') => {
    if (!path) return '/placeholder-backdrop.jpg'
    return `${config.public.imgBase}/${size}${path}`
  }
  
  const profileUrl = (path, size = 'w185') => {
    if (!path) return '/placeholder-person.jpg'
    return `${config.public.imgBase}/${size}${path}`
  }
  
  const logoUrl = (path, size = 'w92') => {
    if (!path) return ''
    return `${config.public.imgBase}/${size}${path}`
  }
  
  const originalImg = (path) => {
    if (!path) return ''
    return `${config.public.imgBase}/original${path}`
  }
  
  const $get = async (path, query = {}) => {
    return await $fetch(`/api/tmdb${path}`, { query })
  }
  
  const moviesPopular = (page = 1, region = 'US', language = 'en-US') => 
    $fetch('/api/tmdb/movie/popular', { query: { page, region, language } })
  
  const moviesTopRated = (page = 1, region = 'US', language = 'en-US') => 
    $fetch('/api/tmdb/movie/top-rated', { query: { page, region, language } })
  
  const moviesUpcoming = (page = 1, region = 'US', language = 'en-US') => 
    $fetch('/api/tmdb/movie/upcoming', { query: { page, region, language } })
  
  const moviesNowPlaying = (page = 1, region = 'US', language = 'en-US') => 
    $fetch('/api/tmdb/movie/now-playing', { query: { page, region, language } })
  
  const movieTrending = (window = 'day', page = 1) => 
    $fetch(`/api/tmdb/trending/movie/${window}`, { query: { page } })
  
  const movieDetail = (id) => 
    $fetch(`/api/tmdb/movie/${id}`, { query: { append_to_response: 'credits,images,recommendations,similar' } })
  
  const movieVideos = (id) => 
    $fetch(`/api/tmdb/movie/${id}/videos`)
  
  const tvPopular = (page = 1, region = 'US', language = 'en-US') => 
    $fetch('/api/tmdb/tv/popular', { query: { page, region, language } })
  
  const tvTopRated = (page = 1, region = 'US', language = 'en-US') => 
    $fetch('/api/tmdb/tv/top-rated', { query: { page, region, language } })
  
  const tvOnTheAir = (page = 1, region = 'US', language = 'en-US') => 
    $fetch('/api/tmdb/tv/on-air', { query: { page, region, language } })
  
  const tvTrending = (window = 'day', page = 1) => 
    $fetch(`/api/tmdb/trending/tv/${window}`, { query: { page } })
  
  const tvDetail = (id) => 
    $fetch(`/api/tmdb/tv/${id}`, { query: { append_to_response: 'aggregate_credits,recommendations,images,videos,similar,external_ids,content_ratings' } })
  
  const personPopular = (page = 1) => 
    $fetch('/api/tmdb/person/popular', { query: { page } })
  
  const personDetail = (id) => 
    $fetch(`/api/tmdb/person/${id}`, { query: { append_to_response: 'combined_credits' } })
  
  const multiSearch = (query, page = 1) => 
    $fetch('/api/tmdb/search', { query: { q: query, page } })
  
  return {
    posterUrl,
    backdropUrl,
    profileUrl,
    logoUrl,
    originalImg,
    $get,
    moviesPopular,
    moviesTopRated,
    moviesUpcoming,
    moviesNowPlaying,
    movieTrending,
    movieDetail,
    movieVideos,
    tvPopular,
    tvTopRated,
    tvOnTheAir,
    tvTrending,
    tvDetail,
    personPopular,
    personDetail,
    multiSearch
  }
}
