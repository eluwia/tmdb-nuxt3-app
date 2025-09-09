<template>
  <div ref="wrap" class="w-full relative">
    <input
      class="min-h-[5vh] md:h-[5vh] sm:h-[5vh] lg:h-[6vh] rounded-full text-slate-900 min-w-full left-0 right-0 pl-3"
      type="search"
      v-model="query"
      placeholder="Search movies, TV shows, people..."
      autocomplete="off"
      role="combobox"
      :aria-expanded="isOpen"
      aria-controls="search-listbox"
      @keydown.down.prevent="moveDown"
      @keydown.up.prevent="moveUp"
      @keydown.enter.prevent="selectHighlighted"
      @keydown.esc.prevent="closeDropdown"
      @focus="isOpen = (results && results.length) > 0"
    />

    <div v-if="isOpen" class="absolute z-10 bg-slate-700 left-0 right-0 mt-2 rounded-md overflow-hidden">
      <div v-if="loading" class="p-2 text-slate-200">Searching...</div>
      <div v-else-if="error" class="p-2 text-red-400">{{ error }}</div>
      <div v-else>
        <div v-if="query && query.length >= 3" class="p-2 border-b border-slate-600">
          <button
            @mousedown.prevent="navigateTo({ path: '/search', query: { q: query, type: 'movie' } })"
            class="block w-full text-left py-1 text-slate-200"
          >
            Search "{{ query }}" in movies
          </button>
          <button
            @mousedown.prevent="navigateTo({ path: '/search', query: { q: query, type: 'tv' } })"
            class="block w-full text-left py-1 text-slate-200"
          >
            Search "{{ query }}" in TV shows
          </button>
          <button
            @mousedown.prevent="navigateTo({ path: '/search', query: { q: query, type: 'person' } })"
            class="block w-full text-left py-1 text-slate-200"
          >
            Search "{{ query }}" in people
          </button>
        </div>

        <div v-if="!results || results.length === 0" class="p-2 text-slate-300">No results.</div>

        <ul v-else id="search-listbox" role="listbox" class="divide-y divide-slate-600">
          <li
            v-for="(item, idx) in results"
            :key="item.id + '-' + (item.media_type || 'x')"
            role="option"
            :aria-selected="idx === highlight"
            @mouseenter="highlight = idx"
            @mousedown.prevent="select(item)"
            :class="idx === highlight ? 'bg-slate-800' : ''"
            class="p-2 cursor-pointer"
          >
            <div class="font-medium text-slate-200">{{ item.title || item.name }}</div>
            <div class="text-sm text-slate-300">{{ item.media_type || (item.title ? 'movie' : (item.first_air_date ? 'tv' : 'person')) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { query, results, loading, error, isOpen, highlight } = useSearch()
const wrap = ref(null)

const select = (item) => {
  if (!item) return
  const type = item.media_type || (item.title ? 'movie' : (item.first_air_date ? 'tv' : 'person'))
  if (type === 'movie') navigateTo(`/movie/${item.id}`)
  else if (type === 'tv') navigateTo(`/tv/${item.id}`)
  else navigateTo(`/person/${item.id}`)
  isOpen.value = false
  highlight.value = -1
}

const moveDown = () => {
  if (!results.value || results.value.length === 0) return
  highlight.value = (highlight.value + 1) % results.value.length
}

const moveUp = () => {
  if (!results.value || results.value.length === 0) return
  highlight.value = (highlight.value - 1 + results.value.length) % results.value.length
}

const selectHighlighted = () => {
  if (!results.value || results.value.length === 0) return
  if (highlight.value < 0) {
    if ((query.value || '').trim().length >= 3) {
      navigateTo({ path: '/search', query: { q: query.value.trim() } })
      isOpen.value = false
      highlight.value = -1
    }
    return
  }
  if (highlight.value >= results.value.length) return
  const item = results.value[highlight.value]
  select(item)
}

const closeDropdown = () => {
  isOpen.value = false
  highlight.value = -1
}

const onDocClick = (e) => {
  if (!isOpen.value) return
  if (!wrap.value) return
  const clickedInside = wrap.value.contains(e.target)
  if (!clickedInside) closeDropdown()
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
