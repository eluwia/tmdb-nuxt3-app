<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { userFavorites } from '../stores/favorites'

const props = defineProps({
  title: { type: String, required: true },
  fetchFn: { type: Function, required: true }, 
  mediaType: { type: String, required: true }, 
  resetKey: { type: Number, default: 0 },
  sanitizeFn: { type: Function, default: null }
})


const items = ref([])
const loading = ref(false)
const error = ref(null)
const page = ref(1)
const hasMore = ref(true)
const sentinelRef = ref(null)
const observer = ref(null)
let ctrl = null
const showFilters = ref(false)

const fav = userFavorites()
fav.init()

function resetList() {
  if (ctrl) ctrl.abort()
  items.value = []
  page.value = 1
  hasMore.value = true
  error.value = null
}

async function loadData() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  error.value = null
  ctrl = new AbortController()
  
  try {
    const data = await props.fetchFn(page.value, { signal: ctrl.signal })
    
    if (!data) {
      throw new Error('No data received from API')
    }
    
    const sanitize = props.sanitizeFn || ((x)=>x)
    const results = sanitize(Array.isArray(data?.results) ? data.results : [], props.mediaType)
    
    if (results.length) {
      items.value.push(...results)
      page.value++
      if (page.value > (data?.total_pages ?? 1)) hasMore.value = false
    } else {
      hasMore.value = false
    }
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error('PageContent loadData error:', e)
      error.value = e?.message || 'Failed to load data. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.resetKey, () => { resetList(); loadData() })
watch(() => props.fetchFn,  () => { resetList(); loadData() })
watch(() => [props.mediaType, props.title], () => { resetList(); loadData() })


onMounted(() => {
  loadData()
  observer.value = new IntersectionObserver(
    (entries) => entries[0]?.isIntersecting && loadData(),
    { root: null, rootMargin: '200px' }
  )
  if (sentinelRef.value) observer.value.observe(sentinelRef.value)
})

onUnmounted(() => {
  if (observer.value && sentinelRef.value) observer.value.unobserve(sentinelRef.value)
  if (observer.value) observer.value.disconnect()
  if (ctrl) ctrl.abort()
})

function isFav(item){ return fav.isFav(props.mediaType, item.id) }
function toggleFav(item) {
  const imagePath = props.mediaType === 'person'
    ? item.profile_path
    : (item.poster_path ?? item.backdrop_path ?? '')
  fav.toggle({
    id: item.id,
    media_type: props.mediaType,
    title: item.title || item.name || '',
    poster_path: imagePath
  })
}

function openFilters() { showFilters.value = true }
function closeFilters() { showFilters.value = false }
</script>

<template>
  <div class="min-h-screen bg-zinc-100 text-white">
    <h1 class="text-zinc-900 text-2xl font-bold px-4 sm:px-8 lg:px-20 py-4">{{ title }}</h1>

    <div class="px-4 sm:px-8 lg:px-20 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      <aside class="hidden lg:block lg:col-span-1 lg:sticky lg:top-20 self-start h-max">
        <div class="space-y-4">
          <slot name="sidebar" ></slot>
        </div>
      </aside>

      <section class="lg:col-span-2">
        <div v-if="error" class="flex flex-col justify-center items-center py-8 text-red-600">
          <p class="text-lg font-medium mb-2">Error loading content</p>
          <p class="text-sm">{{ error }}</p>
          <button 
            @click="resetList(); loadData()" 
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>

        <div v-else class="flex flex-wrap">
          <slot
            name="card"
            v-for="item in items"
            :key="item.id + '::' + (item.release_date || item.first_air_date || '')"
            :item="item"
            :isFav="isFav"
            :toggleFav="toggleFav"
          >
            <div class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 p-2"></div>
          </slot>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>

        <div v-if="!hasMore && !loading" class="text-center py-6 text-gray-400">
          <p>No more results</p>
        </div>

        <div ref="sentinelRef" style="height: 1px"></div>
      </section>
    </div>

    <button
      type="button"
      class="lg:hidden fixed bottom-4 right-4 z-[300] h-12 w-12 rounded-full bg-zinc-900/70 text-white shadow-lg flex items-center justify-center hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
      @click="openFilters"
      aria-label="Open filters"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5h18v2l-7 7v4l-4 2v-6L3 7V5z"/>
      </svg>
    </button>

    <div v-show="showFilters" class="lg:hidden fixed inset-0 z-[350]">
      <div class="absolute inset-0 bg-black/50" @click="closeFilters"></div>
      <div class="absolute inset-x-0 bottom-0 rounded-t-2xl bg-zinc-100 text-zinc-900 p-4 max-h-[80vh] overflow-y-auto no-scrollbar shadow-2xl">
        <div class="flex items-center justify-between mb-3">
                     <button class="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white  group-hover:flex items-center justify-center" @click="closeFilters" title="Close">×</button>

          
        </div>
        <div class="space-y-4">
          <slot name="sidebar"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>