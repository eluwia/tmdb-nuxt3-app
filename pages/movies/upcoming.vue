<template>
  <PageContent
    :key="pageKey"
    title="Upcoming Movies"
    :fetchFn="fetchFn"
    mediaType="movie"
    :resetKey="filtersKey"
  >
    <template #sidebar="{ closeMobileDrawer }">
      <FilterSide mediaType="movie" context="list" :closeMobileDrawer="closeMobileDrawer" @update:modelValue="onFiltersChange" />
    </template>
    <template #card="{ item, isFav, toggleFav }">
      <MovieCard :item="item" :isFav="isFav" :toggleFav="toggleFav" />
    </template>
  </PageContent>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTmdbClient } from '../../composables/useTmdbClient'
import { sanitizeMovies, clientSort } from '../../lib/listHelpers'
import PageContent from '../../components/PageContent.vue'
import FilterSide from '../../components/FilterSide.vue'
import MovieCard from '../../components/MovieCard.vue'

useHead({
  title: 'Upcoming Movies'
})

const route = useRoute()
const { tmdb } = useTmdbClient()
const REGION = 'US'
const LANGUAGE = 'en-US'

const filtersKey = ref(0)
const paramsRef = ref({})
function onFiltersChange(p) { paramsRef.value = p || {}; filtersKey.value++ }

function todayUTC() {
  const d = new Date()
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function fences(p={}) {
  const next = { ...p }
  if (!next['primary_release_date.gte']) next['primary_release_date.gte'] = todayUTC()
  if (!next.with_release_type) next.with_release_type = '2|3'
  if (!next.sort_by?.startsWith?.('popularity')) next.sort_by = 'popularity.desc'
  next.region = REGION
  next.language = LANGUAGE
  next.include_adult = false
  return next
}
function sanitizeUpcoming(list) {
  const cut = todayUTC()
  return (list || [])
    .filter(x => (!x.media_type || x.media_type === 'movie'))
    .filter(x => x.release_date && x.release_date >= cut)
    .sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''))
}
const fetchFn = async (page = 1, opts = {}) => {
  const p = paramsRef.value
  const pp = { ...p }
  if (p._keyword_text) {
    const kw = await tmdb.searchKeyword(p._keyword_text, 1, opts)
    const ids = (kw?.results || []).slice(0,5).map(k=>k.id)
    if (ids.length) pp.with_keywords = ids.join(',')
    delete pp._keyword_text
  }
  const data = await tmdb.discoverMovies(fences({ ...pp, page }), opts)
  data.results = sanitizeUpcoming(data.results)
  return data
}
const pageKey = computed(() => route.fullPath)
</script>
