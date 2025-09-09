<template>
  <PageContent
    :key="pageKey"
    title="Popular People"
    :fetchFn="fetchFn"
    mediaType="person"
    :resetKey="filtersKey"
  >
    <template #sidebar="{ closeMobileDrawer }">
      <FilterSide mediaType="person" context="list" :closeMobileDrawer="closeMobileDrawer" @update:modelValue="onFiltersChange" />
    </template>
    <template #card="{ item }">
      <PersonCard :item="item" />
    </template>
  </PageContent>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTmdbClient } from '../../composables/useTmdbClient'
import { sanitizePeople, clientSort } from '../../lib/listHelpers'
import PageContent from '../../components/PageContent.vue'
import FilterSide from '../../components/FilterSide.vue'
import PersonCard from '../../components/PersonCard.vue'

useHead({
  title: 'Popular People'
})

const route = useRoute()
const { tmdb } = useTmdbClient()

const filtersKey = ref(0)
const paramsRef = ref({})
function onFiltersChange(p) { 
  paramsRef.value = p || {}
  serverPage.value = 1
  lastKnownTotal.value = 999
  filtersKey.value++
}

const serverPage = ref(1)
const lastKnownTotal = ref(999)

const fetchFn = async (_ignoredPageFromContainer = 1, opts = {}) => {
  const p = paramsRef.value
  const MIN_BATCH = 24
  const MAX_HOP = 5
  const batch = []
  let hop = 0

  while (batch.length < MIN_BATCH && serverPage.value <= lastKnownTotal.value && hop < MAX_HOP) {
    const apiPage = serverPage.value
    let data

    if (p._people_query) {
      data = await tmdb.searchPerson(p._people_query, apiPage, opts)
    } else {
      data = await tmdb.personPopular(apiPage, opts)
    }

    if (Number.isFinite(Number(data?.total_pages))) {
      lastKnownTotal.value = Number(data.total_pages)
    }

    let res = sanitizePeople(data?.results)
    if (p.with_known_for_department) res = res.filter(x => x.known_for_department === p.with_known_for_department)
    if (p.with_gender)              res = res.filter(x => String(x.gender) === String(p.with_gender))
    res = clientSort(res, p, 'name')

    batch.push(...res)

    serverPage.value += 1
    hop += 1

    if (serverPage.value > lastKnownTotal.value) break
  }

  const syntheticTotal = serverPage.value > lastKnownTotal.value ? 1 : 999
  return { results: batch, total_pages: syntheticTotal }
}
const pageKey = computed(() => useRoute().fullPath)
</script>
