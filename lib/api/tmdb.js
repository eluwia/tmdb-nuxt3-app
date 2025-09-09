const BASE = 'https://api.themoviedb.org/3'

function buildUrl(path, params = {}) {
  const baseWithSlash = BASE.endsWith('/') ? BASE : BASE + '/'
  const cleanPath = String(path || '').replace(/^\//, '')
  const url = new URL(cleanPath, baseWithSlash)
  const config = useRuntimeConfig()
  const apiKey = config.public.tmdbKey
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', params.language || 'en-US')
  Object.keys(params).forEach(k => {
    if (k === 'language') return
    if (params[k] === undefined || params[k] === null) return
    url.searchParams.set(k, params[k])
  })
  return url.toString()
}

async function get(path, params = {}) {
  const url = buildUrl(path, params)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB request failed: ${res.status}`)
  return res.json()
}

function mergeAppend(existing, required) {
  const set = new Set(
    String(existing || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  )
  String(required || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(s => set.add(s))
  return Array.from(set).join(',')
}

export const tmdbApi = {
  movieDetails(id, opts = {}) {
    const append = mergeAppend(opts.append_to_response, 'credits')
    return get(`/movie/${id}`, { ...opts, append_to_response: append })
  },
  tvDetails(id, opts = {}) {
    const append = mergeAppend(opts.append_to_response, 'credits')
    return get(`/tv/${id}`, { ...opts, append_to_response: append })
  },
  personDetails(id, opts = {}) {
    const append = mergeAppend(opts.append_to_response, 'combined_credits')
    return get(`/person/${id}`, { ...opts, append_to_response: append })
  },
  imageUrl(path, size = 'w342') {
    if (!path) return ''
    return `https://image.tmdb.org/t/p/${size}${path}`
  }
}

export default tmdbApi
