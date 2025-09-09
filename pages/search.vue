<template>
  <div class="p-4">
    <h1 class="text-2xl mb-4">Search results for "{{ q }}"</h1>

    <div v-if="loading">Searching...</div>
    <div v-else-if="results.length === 0">No results</div>

    <div
      v-else
      class="grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-4"
    >
      <div
        v-for="r in results"
        :key="r.id + '-' + (r.media_type || 'x')"
        class="p-2 rounded hover:bg-zinc-50 transition"
      >
        <NuxtLink :to="navTo(r)" class="block">
          <img
            :src="posterUrl(r.poster_path || r.profile_path, 'w342')"
            :alt="r.title || r.name"
            class="w-full aspect-[2/3] object-cover rounded"
            loading="lazy"
          />
          <div class="mt-2 text-sm font-medium line-clamp-2">
            {{ r.title || r.name }}
          </div>
          <div class="text-xs text-zinc-500">
            {{ r.media_type }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

const route = useRoute()
const results = ref([])
const loading = ref(false)
const q = ref(route.query.q || '')
const type = ref(route.query.type || '')

const { posterUrl } = useTmdbClient()

useHead({
  title: q.value ? `"${q.value}" Search results` : 'Search Results'
})

async function run() {
  if (!q.value) return
  loading.value = true
  
  try{
    let data
    if (type.value === 'movie') data = await $fetch('/api/tmdb/search/movie', { query: { q: q.value, page: 1 } })
    else if (type.value === 'tv') data = await $fetch('/api/tmdb/search/tv', { query: { q: q.value, page: 1 } })
    else if (type.value === 'person') data = await $fetch('/api/tmdb/search/person', { query: { q: q.value, page: 1 } })
    else data = await $fetch('/api/tmdb/search/multi', { query: { q: q.value, page: 1 } })
    results.value = Array.isArray(data?.results) ? data.results : []
  }finally{ loading.value = false }
}

run()
watch(()=>route.query, () => { q.value = route.query.q || ''; type.value = route.query.type || ''; run() })

function navTo(r){ 
  const mediaType = r.media_type || (r.title? 'movie': (r.first_air_date? 'tv':'person'))
  if (mediaType === 'tv') return `/tv/${r.id}`
  if (mediaType === 'person') return `/person/${r.id}`
  return `/movie/${r.id}`
}
</script>