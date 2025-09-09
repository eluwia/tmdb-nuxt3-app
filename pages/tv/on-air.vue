<template>
  <PageContent
    :key="pageKey"
    title="TV Shows On The Air"
    :fetchFn="fetchFn"
    mediaType="tv"
    :resetKey="filtersKey"
  >
    <template #sidebar="{ closeMobileDrawer }">
      <FilterSide mediaType="tv" context="list" :closeMobileDrawer="closeMobileDrawer" @update:modelValue="onFiltersChange" />
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
import { sanitizeTV, clientSort } from '../../lib/listHelpers'
import PageContent from '../../components/PageContent.vue'
import FilterSide from '../../components/FilterSide.vue'
import MovieCard from '../../components/MovieCard.vue'

useHead({
  title: 'TV Shows On The Air'
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
    const data = await tmdb.tvOnTheAir(page, REGION, LANGUAGE, opts)
    data.results = sanitizeTV(data.results)
    return data
  }
  const pp = { ...p }
  if (p._keyword_text) {
    const kw = await tmdb.searchKeyword(p._keyword_text, 1, opts)
    const ids = (kw?.results || []).slice(0,5).map(k=>k.id)
    if (ids.length) pp.with_keywords = ids.join(',')
    delete pp._keyword_text
  }
  const data = await tmdb.discoverTV({ ...pp, with_status: '0|1', page, region: REGION, language: LANGUAGE }, opts)
  data.results = clientSort(sanitizeTV(data.results), p, 'name')
  return data
}
const pageKey = computed(() => route.fullPath)
</script>
