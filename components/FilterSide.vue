<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  mediaType: { type: String, required: true },
  context: { type: String, default: 'list' },
  modelValue: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const { logoUrl } = useTmdbClient()

const state = ref({
  language: '',
  genresSelected: [],
  providersSelected: [],
  watchRegion: 'US',
  movieRuntimeMax: 240,
  minVoteCount: 0,
  tvEpisodeRuntimeMax: 60,
  sortBy: '',              
  keywordText: '',

  peopleDepartment: '',
  peopleGender: '',
  peopleKeywordText: '',
  peopleSort: ''           
})

const loading = ref(false)
const genres = ref([])
const providers = ref([])
const loadingProviders = ref(false)
const providerQuery = ref('')

onMounted(async () => {
  if (props.modelValue && Object.keys(props.modelValue).length) {
    state.value = { ...state.value, ...props.modelValue }
  }
  if (props.mediaType === 'movie') {
    await loadMovieGenres()
    await loadMovieProviders()
  } else if (props.mediaType === 'tv') {
    await loadTvGenres()
    await loadTvProviders()
  }
  await nextTick()
  
  // Listen for clear all event from PageContent
  document.addEventListener('clear-all-filters', clearAll)
})

onUnmounted(() => {
  document.removeEventListener('clear-all-filters', clearAll)
})

async function loadMovieGenres() {
  loading.value = true
  try { 
    const data = await $fetch('/api/tmdb/genre/movie/list')
    genres.value = data?.genres || [] 
  }
  catch (e) { console.error('movieGenres failed', e) }
  finally { loading.value = false }
}
async function loadTvGenres() {
  loading.value = true
  try { 
    const data = await $fetch('/api/tmdb/genre/tv/list')
    genres.value = data?.genres || [] 
  }
  catch (e) { console.error('tvGenres failed', e) }
  finally { loading.value = false }
}

async function loadMovieProviders() {
  loadingProviders.value = true
  try { 
    const data = await $fetch('/api/tmdb/watch/providers/movie', { query: { watch_region: state.value.watchRegion || 'US' } })
    providers.value = data?.results || [] 
  }
  catch (e) { console.error('movie providers failed', e) }
  finally { loadingProviders.value = false }
}
async function loadTvProviders() {
  loadingProviders.value = true
  try { 
    const data = await $fetch('/api/tmdb/watch/providers/tv', { query: { watch_region: state.value.watchRegion || 'US' } })
    providers.value = data?.results || [] 
  }
  catch (e) { console.error('tv providers failed', e) }
  finally { loadingProviders.value = false }
}

watch(() => state.value.watchRegion, async () => {
  if (props.mediaType === 'movie') await loadMovieProviders()
  else if (props.mediaType === 'tv') await loadTvProviders()
})

const filteredProviders = computed(() => {
  const q = providerQuery.value.trim().toLowerCase()
  if (!q) return providers.value
  return providers.value.filter(p => (p.provider_name || '').toLowerCase().includes(q))
})

const builtParams = computed(() => {
  const p = {}
  if (props.mediaType === 'movie' || props.mediaType === 'tv') {
    if (state.value.language) p.with_original_language = state.value.language
    if (state.value.genresSelected?.length) p.with_genres = state.value.genresSelected.join(',')
    if (state.value.providersSelected?.length) {
      p.with_watch_providers = state.value.providersSelected.join('|')
      p.watch_region = state.value.watchRegion || 'US'
    }
    if (props.mediaType === 'movie') {
      if (state.value.movieRuntimeMax >= 30) p['with_runtime.lte'] = state.value.movieRuntimeMax
  if (state.value.minVoteCount > 0) p['vote_count.gte'] = state.value.minVoteCount
    } else {
      if (state.value.tvEpisodeRuntimeMax >= 10) p['with_runtime.lte'] = state.value.tvEpisodeRuntimeMax
  if (state.value.minVoteCount > 0) p['vote_count.gte'] = state.value.minVoteCount
    }
  if (state.value.sortBy === 'popularity.asc') p.sort_by = 'popularity.asc'
  if (state.value.sortBy === 'popularity.desc') p.sort_by = 'popularity.desc'
  if (state.value.sortBy === 'vote_average.desc') p.sort_by = 'vote_average.desc'
  if (state.value.sortBy === 'vote_average.asc') p.sort_by = 'vote_average.asc'
  if (state.value.sortBy === 'az.asc') p._client_sort = 'az.asc'
  if (state.value.sortBy === 'az.desc') p._client_sort = 'az.desc'
    if (state.value.keywordText?.trim()) p._keyword_text = state.value.keywordText.trim()
  } else {
    if (state.value.peopleDepartment) p.with_known_for_department = state.value.peopleDepartment
    if (state.value.peopleGender) p.with_gender = state.value.peopleGender
    if (state.value.peopleKeywordText?.trim()) p._people_query = state.value.peopleKeywordText.trim()
    if (state.value.peopleSort) p._client_sort = state.value.peopleSort
  }
  return p
})



function apply() { emit('update:modelValue', builtParams.value) }
async function clearAll() {
  state.value = {
    language: '',
    genresSelected: [],
    providersSelected: [],
    watchRegion: 'US',
    movieRuntimeMax: 240,
  minVoteCount: 0,
    tvEpisodeRuntimeMax: 60,
    sortBy: '',
    keywordText: '',
    peopleDepartment: '',
    peopleGender: '',
    peopleKeywordText: '',
    peopleSort: ''
  }
  providerQuery.value = ''
  await nextTick()
  emit('update:modelValue', builtParams.value)
}

function isGenreActive(id) { return state.value.genresSelected.includes(id) }
function toggleGenre(id) {
  const a = state.value.genresSelected
  const i = a.indexOf(id); i > -1 ? a.splice(i,1) : a.push(id)
}
function isProviderActive(id) { return state.value.providersSelected.includes(id) }
function toggleProvider(id) {
  const a = state.value.providersSelected
  const i = a.indexOf(id); i > -1 ? a.splice(i,1) : a.push(id)
}
function chipClass(active) {
  return active
    ? 'px-3 py-1 rounded-full text-sm bg-zinc-800 text-white'
    : 'px-3 py-1 rounded-full text-sm bg-zinc-200 text-zinc-700 hover:bg-zinc-200'
}

</script>

<template>
  <div class="bg-zinc-100 rounded-xl text-zinc-800" style="min-height: 100%;">
    <div class="p-4 space-y-5">

      <div v-if="props.mediaType !== 'person'">
        <label class="block text-sm font-medium mb-1">Sort</label>
        <select v-model="state.sortBy" class="w-full px-3 py-2 border rounded-md">
          <option value="">Default</option>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="az.asc">A–Z Ascending</option>
          <option value="az.desc">A–Z Descending</option>
        </select>
      </div>

      <template v-if="props.mediaType !== 'person'">
        <div>
          <label class="block text-sm font-medium mb-1">Language</label>
          <select v-model="state.language" class="w-full px-3 py-2 border rounded-md">
            <option value="">Any</option>
            <option value="en">English</option>
            <option value="tr">Turkish</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Genres</label>
          <div v-if="loading" class="text-sm text-gray-500">Loading genres...</div>
          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="g in genres"
              :key="g.id"
              type="button"
              :class="chipClass(isGenreActive(g.id))"
              @click="toggleGenre(g.id)"
            >
              {{ g.name }}
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium">Where to watch</label>
            <select v-model="state.watchRegion" class="px-2 py-1 border rounded-md text-sm">
              <option value="US">US</option>
              <option value="TR">TR</option>
              <option value="GB">GB</option>
              <option value="DE">DE</option>
              <option value="FR">FR</option>
            </select>
          </div>

          <input
            v-model="providerQuery"
            placeholder="Search providers..."
            class="w-full mb-2 px-3 py-2 border rounded-md"
          />

          <div v-if="loadingProviders" class="text-sm text-gray-500">Loading providers...</div>
          <div v-else class="max-h-24 overflow-auto no-scrollbar space-y-1">
            <div v-if="filteredProviders.length === 0" class="text-sm text-gray-500 px-1 py-1">
              No providers
            </div>
            <label
              v-for="p in filteredProviders"
              :key="p.provider_id"
              class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                :checked="state.providersSelected.includes(p.provider_id)"
                @change="toggleProvider(p.provider_id)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <img
                v-if="p.logo_path"
                :src="logoUrl(p.logo_path,'w92')"
                :alt="p.provider_name"
                class="w-6 h-6 object-contain rounded"
                loading="lazy"
              />
              <span class="text-sm text-gray-700">{{ p.provider_name }}</span>
            </label>
          </div>
        </div>

        <div v-if="props.mediaType === 'movie'">
          <label class="block text-sm font-medium mb-1">Max runtime (movie, minutes)</label>
          <input type="range" min="30" max="300" step="10" v-model.number="state.movieRuntimeMax" class="w-full" />
          <div class="text-xs text-zinc-500">{{ state.movieRuntimeMax }} min</div>
        </div>
        <div v-else>
          <label class="block text-sm font-medium mb-1">Max episode runtime (TV, minutes)</label>
          <input type="range" min="10" max="120" step="5" v-model.number="state.tvEpisodeRuntimeMax" class="w-full" />
          <div class="text-xs text-zinc-500">{{ state.tvEpisodeRuntimeMax }} min / ep</div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Min user votes</label>
          <input type="range" min="0" max="5000" step="10" v-model.number="state.minVoteCount" class="w-full" />
          <div class="text-xs text-zinc-500">{{ state.minVoteCount }} votes</div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Filter by keyword</label>
          <input v-model="state.keywordText" placeholder="e.g., time travel" class="w-full px-3 py-2 border rounded-md" />
        </div>
      </template>

      <template v-else>
        <div>
          <label class="block text-sm font-medium mb-1">Department</label>
          <select v-model="state.peopleDepartment" class="w-full px-3 py-2 border rounded-md">
            <option value="">Any</option>
            <option value="Acting">Acting</option>
            <option value="Directing">Directing</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Gender</label>
          <select v-model="state.peopleGender" class="w-full px-3 py-2 border rounded-md">
            <option value="">Any</option>
            <option value="1">Female</option>
            <option value="2">Male</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Search by name</label>
          <input v-model="state.peopleKeywordText" placeholder="e.g., adam" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Sort</label>
          <select v-model="state.peopleSort" class="w-full px-3 py-2 border rounded-md">
            <option value="">Default</option>
            <option value="az.asc">A–Z Ascending</option>
            <option value="az.desc">A–Z Descending</option>
          </select>
        </div>
      </template>
  </div>

      <div class="pt-4 pb-10">
        <button class="w-full bg-zinc-900 text-white rounded-full h-14 py-3 hover:bg-zinc-800" @click="apply">
          Apply
        </button>
      </div>
  </div>
</template>
