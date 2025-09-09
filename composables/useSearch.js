export function useSearch() {
  const query = ref('')
  const results = ref([])
  const loading = ref(false)
  const error = ref('')
  const isOpen = ref(false)
  const highlight = ref(-1)
  
  let debounceTimer = null
  let controller = null
  const cache = new Map()
  
  watch(query, (val) => {
    clearTimeout(debounceTimer)
    
    const q = (val || '').trim()
    if (q.length < 3) {
      results.value = []
      isOpen.value = false
      highlight.value = -1
      return
    }
    
    debounceTimer = setTimeout(() => runSearch(q), 500)
  })
  
  async function runSearch(q) {
    if (cache.has(q)) {
      results.value = cache.get(q)
      isOpen.value = results.value.length > 0
      return
    }
    
    if (controller) controller.abort()
    controller = new AbortController()
    loading.value = true
    error.value = ''
    
    try {
      const { useTmdbClient } = await import('./useTmdbClient')
      const { tmdb } = useTmdbClient()
      const data = await tmdb.multiSearch(q, 1)
      const items = Array.isArray(data?.results) ? data.results.slice(0, 10) : []
      
      results.value = items
      cache.set(q, items)
      isOpen.value = items.length > 0
    } catch (e) {
      if (e?.name !== 'AbortError') {
        error.value = 'Search failed. Please try again.'
        isOpen.value = false
      }
    } finally {
      loading.value = false
    }
  }
  
  return { query, results, loading, error, isOpen, highlight }
}
