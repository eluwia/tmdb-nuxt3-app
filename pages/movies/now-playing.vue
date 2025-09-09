<template>
  <PageContent
    :key="pageKey"
    title="Now Playing Movies"
    :fetchFn="fetchFn"
    mediaType="movie"
    :resetKey="filtersKey"
  >
    <template #sidebar>
      <FilterSide mediaType="movie" context="list" @update:modelValue="onFiltersChange" />
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
  title: 'Now Playing Movies'
})

const route = useRoute()
const { tmdb } = useTmdbClient()
const REGION = 'US'
const LANGUAGE = 'en-US'

const filtersKey = ref(0)
const paramsRef = ref({})
function onFiltersChange(p) { paramsRef.value = p || {}; filtersKey.value++ }

const fetchFn = async (page = 1, opts = {}) => {
  const p = paramsRef.value
  const hasFilters = Object.keys(p).length > 0
  if (!hasFilters) {
    const currentDate = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(currentDate.getMonth() - 1) 
    return tmdb.discoverMovies({ 
      page,
      sort_by: 'popularity.desc',
      'primary_release_date.gte': lastMonth.toISOString().split('T')[0],
      'primary_release_date.lte': currentDate.toISOString().split('T')[0],
      region: REGION,
      language: LANGUAGE,
      include_adult: false
    })
  }
  const pp = { ...p }
  if (p._keyword_text) {
    const kw = await tmdb.searchKeyword(p._keyword_text, 1, opts)
    const ids = (kw?.results || []).slice(0,5).map(k=>k.id)
    if (ids.length) pp.with_keywords = ids.join(',')
    delete pp._keyword_text
  }
  const data = await tmdb.discoverMovies({ ...pp, page, region: REGION, language: LANGUAGE }, opts)
  data.results = clientSort(sanitizeMovies(data.results), p, 'title')
  return data
}
const pageKey = computed(() => route.fullPath)
</script>