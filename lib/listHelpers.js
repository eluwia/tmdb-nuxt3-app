export function sanitizeMovies(list) {
  return (list || []).filter(x => (!x.media_type || x.media_type === 'movie')).filter(x => (x.title || '').trim().length >= 2)
}

export function sanitizeTV(list) {
  return (list || []).filter(x => (!x.media_type || x.media_type === 'tv')).filter(x => (x.name || '').trim().length >= 2)
}

export function sanitizePeople(list) {
  return (list || []).filter(p => (p.name || '').trim().length >= 1)
}

export function clientSort(list, p, key = 'title') {
  if (p?._client_sort === 'az.asc') return [...list].sort((a,b)=> ( (a[key]||'') .localeCompare(b[key]||'')))
  if (p?._client_sort === 'az.desc') return [...list].sort((a,b)=> ( (b[key]||'') .localeCompare(a[key]||'')))
  return list
}
