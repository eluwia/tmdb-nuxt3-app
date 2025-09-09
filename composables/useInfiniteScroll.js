export const useInfiniteScroll = (loadMore) => {
  const loading = ref(false)
  const hasMore = ref(true)
  const page = ref(1)
  
  const loadNext = async () => {
    if (loading.value || !hasMore.value) return
    
    loading.value = true
    page.value++
    
    try {
      const result = await loadMore(page.value)
      if (!result || result.length === 0) {
        hasMore.value = false
      }
      return result
    } finally {
      loading.value = false
    }
  }
  
  const reset = () => {
    page.value = 1
    hasMore.value = true
    loading.value = false
  }
  
  return {
    loading,
    hasMore,
    page,
    loadNext,
    reset
  }
}
