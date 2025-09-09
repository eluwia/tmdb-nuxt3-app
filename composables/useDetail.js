import { ref, computed, onMounted } from 'vue'
import { useDetailsStore } from '../stores/details'

export function useDetail(type, id) {
  const store = useDetailsStore()
  const key = `${type}:${id}`
  const local = ref(store.items[key] || null)

  const entity = computed(() => (store.items[key]||{}).entity || null)
  const isLoading = computed(() => (store.items[key]||{}).loading === true)
  const error = computed(() => (store.items[key]||{}).error || null)

  async function refetch(){
    if (type === 'movie') return store.fetchMovie(id)
    if (type === 'tv') return store.fetchTv(id)
    if (type === 'person') return store.fetchPerson(id)
  }

  onMounted(()=>{ if (!store.items[key] || Date.now() - (store.items[key].fetchedAt||0) > 15*60*1000) refetch() })

  return { entity, isLoading, error, refetch }
}

export default useDetail