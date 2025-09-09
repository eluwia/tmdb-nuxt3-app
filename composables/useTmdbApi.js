export const useTmdbApi = () => {
  const config = useRuntimeConfig()
  
  const BASE = 'https://api.themoviedb.org/3'
  
  function makeUrl(path, params = {}) {
    const u = new URL(BASE + path)
    u.searchParams.set('api_key', config.public.tmdbKey)
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v)
    }
    return u.toString()
  }
  
  function get(path, params = {}, opts = {}) {
    const url = makeUrl(path, params)
    const options = { method: 'GET', headers: { accept: 'application/json' }, ...opts }
    return fetch(url, options).then((res) => {
      if (!res.ok) throw new Error('TMDB request failed: ' + res.status)
      return res.json()
    })
  }
  
  const tmdb = {
    movieWatchProvidersList: (region = 'US', opts = {}) =>
      get('/watch/providers/movie', { watch_region: region }, opts),
    tvWatchProvidersList: (region = 'US', opts = {}) =>
      get('/watch/providers/tv', { watch_region: region }, opts),

    moviesPopular: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/movie/popular', { page, region, language }, opts),
    moviesTopRated: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/movie/top_rated', { page, region, language }, opts),
    moviesUpcoming: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/movie/upcoming', { page, region, language }, opts),
    moviesNowPlaying: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/movie/now_playing', { page, region, language }, opts),
    movieTrending: (window = 'day', page = 1, opts = {}) =>
      get(`/trending/movie/${window}`, { page }, opts),

    movieDetail: (id, opts = {}) =>
      get(`/movie/${id}`, { append_to_response: 'credits,images,recommendations,similar' }, opts),
    movieCredits: (id, opts = {}) => get(`/movie/${id}/credits`, {}, opts),
    movieImages: (id, opts = {}) => get(`/movie/${id}/images`, {}, opts),
    movieVideos: (id, opts = {}) => get(`/movie/${id}/videos`, {}, opts),
    movieRecommendations: (id, page = 1, opts = {}) => get(`/movie/${id}/recommendations`, { page }, opts),
    movieSimilar: (id, page = 1, opts = {}) => get(`/movie/${id}/similar`, { page }, opts),
    movieReviews: (id, page = 1, opts = {}) => get(`/movie/${id}/reviews`, { page }, opts),
    movieExternalIds: (id, opts = {}) => get(`/movie/${id}/external_ids`, {}, opts),
    movieReleaseDates: (id, opts = {}) => get(`/movie/${id}/release_dates`, {}, opts),
    movieWatchProviders: (id, opts = {}) => get(`/movie/${id}/watch/providers`, {}, opts),

    tvPopular: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/tv/popular', { page, region, language }, opts),
    tvTopRated: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/tv/top_rated', { page, region, language }, opts),
    tvOnTheAir: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/tv/on_the_air', { page, region, language }, opts),
    tvAiringToday: (page = 1, region = 'US', language = 'en-US', opts = {}) =>
      get('/tv/airing_today', { page, region, language }, opts),
    tvTrending: (window = 'day', page = 1, opts = {}) =>
      get(`/trending/tv/${window}`, { page }, opts),

    tvDetail: (id, opts = {}) =>
      get(`/tv/${id}`, {
        append_to_response: 'aggregate_credits,recommendations,images,videos,similar,external_ids,content_ratings'
      }, opts),
    tvAggregateCredits: (id, opts = {}) => get(`/tv/${id}/aggregate_credits`, {}, opts),
    tvCredits: (id, opts = {}) => get(`/tv/${id}/credits`, {}, opts),
    tvImages: (id, opts = {}) => get(`/tv/${id}/images`, {}, opts),
    tvVideos: (id, opts = {}) => get(`/tv/${id}/videos`, {}, opts),
    tvRecommendations: (id, page = 1, opts = {}) => get(`/tv/${id}/recommendations`, { page }, opts),
    tvSimilar: (id, page = 1, opts = {}) => get(`/tv/${id}/similar`, { page }, opts),
    tvReviews: (id, page = 1, opts = {}) => get(`/tv/${id}/reviews`, { page }, opts),
    tvExternalIds: (id, opts = {}) => get(`/tv/${id}/external_ids`, {}, opts),
    tvContentRatings: (id, opts = {}) => get(`/tv/${id}/content_ratings`, {}, opts),
    tvWatchProviders: (id, opts = {}) => get(`/tv/${id}/watch/providers`, {}, opts),
    tvKeywords: (id, opts = {}) => get(`/tv/${id}/keywords`, {}, opts),

    tvSeasonDetail: (id, seasonNumber, opts = {}) => get(`/tv/${id}/season/${seasonNumber}`, {}, opts),
    tvSeasonCredits: (id, seasonNumber, opts = {}) => get(`/tv/${id}/season/${seasonNumber}/credits`, {}, opts),
    tvSeasonImages: (id, seasonNumber, opts = {}) => get(`/tv/${id}/season/${seasonNumber}/images`, {}, opts),
    tvSeasonVideos: (id, seasonNumber, opts = {}) => get(`/tv/${id}/season/${seasonNumber}/videos`, {}, opts),

    tvEpisodeDetail: (id, s, e, opts = {}) => get(`/tv/${id}/season/${s}/episode/${e}`, {}, opts),
    tvEpisodeCredits: (id, s, e, opts = {}) => get(`/tv/${id}/season/${s}/episode/${e}/credits`, {}, opts),
    tvEpisodeImages: (id, s, e, opts = {}) => get(`/tv/${id}/season/${s}/episode/${e}/images`, {}, opts),
    tvEpisodeVideos: (id, s, e, opts = {}) => get(`/tv/${id}/season/${s}/episode/${e}/videos`, {}, opts),

    personPopular: (page = 1, opts = {}) => get('/person/popular', { page }, opts),
    personDetail: (id, opts = {}) => get(`/person/${id}`, { append_to_response: 'combined_credits' }, opts),
    personMovieCredits: (id, opts = {}) => get(`/person/${id}/movie_credits`, {}, opts),
    personTVCredits: (id, opts = {}) => get(`/person/${id}/tv_credits`, {}, opts),
    personCombinedCredits: (id, opts = {}) => get(`/person/${id}/combined_credits`, {}, opts),
    personImages: (id, opts = {}) => get(`/person/${id}/images`, {}, opts),
    personTaggedImages: (id, page = 1, opts = {}) => get(`/person/${id}/tagged_images`, { page }, opts),
    personExternalIds: (id, opts = {}) => get(`/person/${id}/external_ids`, {}, opts),
    personTranslations: (id, opts = {}) => get(`/person/${id}/translations`, {}, opts),
    personChanges: (id, page = 1, opts = {}) => get(`/person/${id}/changes`, { page }, opts),
    personLatest: (opts = {}) => get('/person/latest', {}, opts),
    personTrending: (window = 'day', page = 1, opts = {}) =>
      get(`/trending/person/${window}`, { page }, opts),

    discoverMovies: (params = {}, opts = {}) => get('/discover/movie', params, opts),
    discoverTV:     (params = {}, opts = {}) => get('/discover/tv', params, opts),
    discoverPeople: (params = {}, opts = {}) => get('/discover/person', params, opts),

    movieGenres: (opts = {}) => get('/genre/movie/list', {}, opts),
    tvGenres:    (opts = {}) => get('/genre/tv/list', {}, opts),

    multiSearch:   (query, page = 1, opts = {}) => get('/search/multi', { query, page, include_adult: 'false' }, opts),

    searchMovie: (query, page = 1, opts = {}) => get('/search/movie', { query, page, include_adult: 'false' }, opts),
    searchTV:    (query, page = 1, opts = {}) => get('/search/tv', { query, page, include_adult: 'false' }, opts),

    searchKeyword: (query, page = 1, opts = {}) => get('/search/keyword', { query, page }, opts),
    searchPerson:  (query, page = 1, opts = {}) => get('/search/person', { query, page, include_adult: 'false' }, opts),

    configuration: (opts = {}) => get('/configuration', {}, opts)
  }

  const IMG_BASE = (size) => `https://image.tmdb.org/t/p/${size}`
  const posterUrl   = (path, size = 'w500')  => (path ? `${IMG_BASE(size)}${path}` : '')
  const backdropUrl = (path, size = 'w780')  => (path ? `${IMG_BASE(size)}${path}` : '')
  const profileUrl  = (path, size = 'w185')  => (path ? `${IMG_BASE(size)}${path}` : '')
  const originalImg = (path)                 => (path ? `${IMG_BASE('original')}${path}` : '')
  const logoUrl = (path, size = 'w92') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : '')

  return {
    tmdb,
    posterUrl,
    backdropUrl,
    profileUrl,
    originalImg,
    logoUrl
  }
}
