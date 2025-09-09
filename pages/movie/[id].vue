<template> 
  <div v-if="isLoading" class="min-h-screen bg-zinc-100">
    <div class="animate-pulse">
      <div class="h-96 bg-gray-300"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-64 md:w-80 h-96 bg-gray-300 rounded-lg"></div>
          <div class="flex-1 space-y-4">
            <div class="h-8 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-4 bg-gray-300 rounded w-1/3"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-300 rounded"></div>
              <div class="h-4 bg-gray-300 rounded"></div>
              <div class="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen bg-zinc-100 flex items-center justify-center">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Failed to load movie</h1>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <button
        @click="refetch"
        class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>

  <div v-else-if="entity && !isLoading">
    <section class="relative w-full text-white overflow-hidden min-h-[calc(100vh-64px)]" :style="heroStyle">
      <div class="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60"></div>

      <div class="relative z-10 h-full py-16 md:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 items-start">
          <div class="w-64 md:w-80 flex-shrink-0">
            <div class="aspect-[2/3] rounded-lg shadow-xl overflow-hidden bg-gray-900">
              <img v-if="entity?.poster_path" :src="posterUrl(entity.poster_path,'w780')" :alt="entity?.title || 'Movie'" class="w-full h-full object-cover transition-opacity hover:opacity-75" loading="lazy" />
              <div v-else class="w-full h-full bg-gray-800 animate-pulse"></div>
            </div>
          </div>

          <div class="flex-1 space-y-6">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold">
                {{ entity?.title || 'Movie' }} <span class="font-normal opacity-75">({{ year }})</span>
              </h1>
              <p v-if="entity?.tagline" class="text-lg text-slate-300 mt-2 italic">{{ entity.tagline }}</p>
            </div>

            <div class="flex items-center space-x-6">
              <div class="flex items-center gap-4">
                <div class="bg-amber-400 text-slate-900 font-bold text-lg rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                  {{ scorePct }}
                </div>
                <div class="text-base">
                  <div class="font-semibold">User Score</div>
                  <div class="text-sm text-slate-300">({{ entity?.vote_count || 0 }} votes)</div>
                </div>
              </div>

              <button @click="toggleFav" class="p-4 rounded-full h-14 w-14 bg-slate-800/80 text-white hover:bg-slate-700/80 transition-colors shadow-lg" aria-label="favorite" :aria-pressed="isFav(entity)">
                <span v-if="isFav(entity)" class=" text-xl">★</span>
                <span v-else class="text-xl">☆</span>
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <span v-for="g in entity.genres || []" :key="g.id" class="px-4 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-full text-sm font-medium transition-colors">
                {{ g.name }}
              </span>
            </div>

            <div class="grid md:grid-cols-[2fr,1fr] gap-8">
              <div class="space-y-6">
                <div class="space-y-4">
                  <h3 class="text-2xl font-semibold">Overview</h3>
                  <p class="text-lg text-slate-300 leading-relaxed">{{ entity.overview }}</p>
                </div>

                <div v-if="director || writer" class="space-y-3">
                  <div v-if="director" class="flex gap-2">
                    <span class="font-semibold">Director:</span>
                    <span class="text-slate-300">{{ director }}</span>
                  </div>
                  <div v-if="writer" class="flex gap-2">
                    <span class="font-semibold">Writer:</span>
                    <span class="text-slate-300">{{ writer }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="bg-slate-800/60 rounded-lg p-6">
                  <h4 class="text-lg font-semibold mb-4">Movie Info</h4>
                  <dl class="space-y-3 text-sm">
                    <div v-for="[label, value] in Object.entries(info)" :key="label" class="grid grid-cols-2 gap-2">
                      <dt class="text-slate-300">{{ formatLabel(label) }}</dt>
                      <dd class="font-medium">{{ value }}</dd>
                    </div>
                  </dl>
                </div>

                <div v-if="keywords.length" class="space-y-4">
                  <h4 class="text-lg font-semibold">Keywords</h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="k in keywords" :key="k.id" class="px-3 py-1 bg-slate-800/60 hover:bg-slate-700/60 rounded text-sm transition-colors cursor-pointer">
                      {{ k.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </section>

    <DetailLayout>
      <div class="text-zinc-800 max-w-6xl mx-auto mt-6">

        <section class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold">Media</h3>
            <div class="flex gap-2">
              <button class="px-3 py-1 rounded-full text-sm" :class="mediaTab==='posters' ? 'bg-zinc-500 text-white' : 'bg-zinc-300 text-zinc-700 hover:bg-zinc-400'" @click="mediaTab='posters'">Posters</button>
              <button class="px-3 py-1 rounded-full text-sm" :class="mediaTab==='videos' ? 'bg-zinc-500 text-white' : 'bg-zinc-300 text-zinc-700 hover:bg-zinc-400'" @click="mediaTab='videos'">Videos</button>
              <button class="px-3 py-1 rounded-full text-sm" :class="mediaTab==='backdrops' ? 'bg-zinc-500 text-white' : 'bg-zinc-300 text-zinc-700 hover:bg-zinc-400'" @click="mediaTab='backdrops'">Backdrops</button>
            </div>
          </div>

          <div class="relative no-scrollbar">
            <button v-if="mediaFiltered.length" class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-10 w-10 rounded-full bg-black/20 text-white" @click="scrollMediaLeft">←</button>
            <div ref="mediaTrack" class="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pr-2 touch-pan-x">
              <div v-for="(m, i) in mediaFiltered" :key="(m.key||m.file_path||m.iso_639_1||m.image||'i') + '-' + i" class="snap-start min-w-[220px] md:min-w-[260px]">
                <div class="relative rounded-lg overflow-hidden bg-zinc-800 shadow group">
                  <button v-if="m.kind==='video'" type="button" class="block w-full" @click="openTrailer(m)">
                    <img :src="m.image" class="w-full h-44 object-cover" loading="lazy" />
                    <span class="absolute inset-0 grid place-items-center">
                      <span class="inline-grid place-items-center rounded-full bg-white/90 backdrop-blur w-12 h-12 shadow ring-1 ring-black/10 group-hover:scale-105 transition">
                        <svg viewBox="0 0 24 24" class="w-6 h-6 fill-zinc-900"><path d="M8 5v14l11-7z"/></svg>
                      </span>
                    </span>
                  </button>
                  <img v-else-if="m.image" :src="m.image" class="w-full h-44 object-cover" loading="lazy" />
                  <img v-else :src="m" class="w-full h-44 object-cover" loading="lazy" />
                </div>
                <div v-if="mediaTab==='videos'" class="mt-2 text-sm font-medium truncate max-w-[260px]">
                  {{ m.name || m.file_path || (m.type === 'Trailer' ? 'Trailer' : '') }}
                </div>
              </div>
            </div>
            <button v-if="mediaFiltered.length" class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-10 w-10 rounded-full bg-black/20 text-white" @click="scrollMediaRight">→</button>
          </div>
        </section>

        <section class="mb-8">
          <h3 class="text-lg font-semibold mb-3">Crew</h3>
          <div class="relative no-scrollbar">
            <button v-if="crewItems.length" class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-10 w-10 rounded-full bg-black/20 text-white" @click="scrollCrewLeft">←</button>
            <div ref="crewTrack" class="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pr-2 touch-pan-x">
              <div v-for="c in crewItems" :key="c.id + '-' + (c.credit_id||'')" class="snap-start min-w-[140px]">
                <NuxtLink :to="`/person/${c.id}`" class="block">
                  <div class="aspect-[2/3] rounded overflow-hidden bg-zinc-100">
                    <img v-if="c.profile_path" :src="profileUrl(c.profile_path,'w185')" class="w-full h-full object-cover" loading="lazy" />
                    <div v-else class="w-full h-full bg-zinc-300"></div>
                  </div>
                  <div class="mt-2 text-sm">{{ c.name }}</div>
                  <div class="text-xs text-zinc-500">{{ c.job }}</div>
                </NuxtLink>
              </div>
            </div>
            <button v-if="crewItems.length" class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-10 w-10 rounded-full bg-black/20 text-white" @click="scrollCrewRight">→</button>
          </div>
        </section>

        <section v-if="recItems.length" class="mb-8">
          <h3 class="text-lg font-semibold mb-3">Recommendations</h3>
          <div class="relative no-scrollbar">
            <button v-if="recItems.length" class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-10 w-10 rounded-full bg-black/20 text-white" @click="scrollRecLeft">←</button>
            <div ref="recTrack" class="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pr-2 touch-pan-x">
              <div v-for="r in recItems" :key="r.id" class="snap-start min-w-[160px] sm:min-w-[180px] lg:min-w-[200px]">
                <NuxtLink :to="`/movie/${r.id}`" class="block">
                  <div class="aspect-[2/3] w-full overflow-hidden rounded-lg bg-slate-800/60 shadow-lg">
                    <img :src="posterUrl(r.poster_path,'w342')" class="w-full h-full object-cover transition-opacity hover:opacity-75" loading="lazy" />
                  </div>
                </NuxtLink>
                <div class="mt-2 text-sm font-medium">{{ r.title || r.name }}</div>
              </div>
            </div>
            <button v-if="recItems.length" class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center h-10 w-10 rounded-full bg-black/20 text-white" @click="scrollRecRight">→</button>
          </div>
        </section>
      </div>

      <div v-if="activeTrailer" class="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="relative w-full max-w-5xl">
          <button aria-label="Close" type="button" @click="closeTrailer" class="absolute h-8 w-8 -top-10 right-0 bg-white/20 hover:bg-white/30 text-white rounded-full px-2 py-1 text-sm">✕</button>
          <div class="aspect-[16/9] w-full rounded-lg overflow-hidden shadow">
            <iframe class="w-full h-full" :src="videoEmbedUrl(activeTrailer)" :title="activeTrailer.name" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture; accelerometer; clipboard-write; gyroscope" allowfullscreen></iframe>
          </div>
          <div class="mt-3 flex items-center justify-between text-zinc-200 text-sm">
            <div class="font-medium">{{ activeTrailer.name }}</div>
            <div class="opacity-75">{{ formatDate(activeTrailer.published_at) }}</div>
          </div>
        </div>
      </div>
    </DetailLayout>
  </div>

  <div v-else class="text-gray-500">No data</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDetail } from '../../composables/useDetail'
import { useTmdbClient } from '../../composables/useTmdbClient'
import { useFavoritesStore } from '../../stores/favorites'

const route = useRoute()
const id = route.params.id
const { entity, isLoading, error } = useDetail('movie', id)

const { posterUrl, backdropUrl, profileUrl, tmdb } = useTmdbClient()
const favoritesStore = useFavoritesStore()

onMounted(() => {
  favoritesStore.init()
})

const isFav = (e) => favoritesStore.isFav(e ? e.media_type || 'movie' : 'movie', e ? e.id : id)

function toggleFav() {
  const e = entity.value
  if (!e) return
  favoritesStore.toggle({ id: e.id, media_type: 'movie', title: e.title || '', poster_path: e.poster_path || '' })
}

const year = computed(() => (entity.value && entity.value.release_date) ? (entity.value.release_date || '').slice(0,4) : '')
const scorePct = computed(() => entity.value ? Math.round((entity.value.vote_average || 0) * 10) + '%' : '')
const heroStyle = computed(() => {
  if (!entity.value || !entity.value.backdrop_path) return {}
  const url = backdropUrl(entity.value.backdrop_path, 'original')
  return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center top', width: '100%' }
})

const director = computed(() => {
  if (!crewItems.value?.length) return ''
  const directors = crewItems.value.filter(c => c.job === 'Director')
  return directors.map(d => d.name).join(', ')
})
const writer = computed(() => {
  if (!crewItems.value?.length) return ''
  const writers = crewItems.value.filter(c => c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Story')
  return writers.map(w => w.name).join(', ')
})

function formatLabel(label) {
  return label.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
function formatDate(dateStr, locale = 'en-EN') {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
}

const mediaPosters = ref([])
const mediaBackdrops = ref([])
const mediaVideos = ref([])
const mediaTab = ref('posters')
const mediaFiltered = computed(() => {
  if (mediaTab.value === 'backdrops') return mediaBackdrops.value
  if (mediaTab.value === 'videos') return mediaVideos.value
  return mediaPosters.value
})
const crewItems = ref([])
const recItems = ref([])

const mediaTrack = ref(null)
const crewTrack = ref(null)
const recTrack = ref(null)

function scroll(elRef, amount = null) {
  const el = elRef && elRef.value
  if (!el) return
  const delta = amount || Math.floor(el.clientWidth * 0.9)
  el.scrollBy({ left: delta, behavior: 'smooth' })
}
function scrollMediaLeft() { scroll(mediaTrack, -Math.floor((mediaTrack.value?.clientWidth||0) * 0.9)) }
function scrollMediaRight() { scroll(mediaTrack,  Math.floor((mediaTrack.value?.clientWidth||0) * 0.9)) }
function scrollCrewLeft() { scroll(crewTrack, -Math.floor((crewTrack.value?.clientWidth||0) * 0.9)) }
function scrollCrewRight() { scroll(crewTrack,  Math.floor((crewTrack.value?.clientWidth||0) * 0.9)) }
function scrollRecLeft() { scroll(recTrack, -Math.floor((recTrack.value?.clientWidth||0) * 0.9)) }
function scrollRecRight() { scroll(recTrack,  Math.floor((recTrack.value?.clientWidth||0) * 0.9)) }

const keywords = ref([])
const info = ref({
  status: '',
  release: '',
  runtime: '',
  budget: '',
  revenue: '',
  original_language: ''
})

const activeTrailer = ref(null)
function ytThumb(key) { return `https://i.ytimg.com/vi/${key}/hqdefault.jpg` }
function videoEmbedUrl(v) {
  if (!v) return ''
  if (v.site === 'YouTube') return `https://www.youtube-nocookie.com/embed/${v.key}?autoplay=1&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3`
  if (v.site === 'Vimeo') return `https://player.vimeo.com/video/${v.key}?autoplay=1&title=0&byline=0&portrait=0`
  return ''
}
function openTrailer(t) { activeTrailer.value = t }
function closeTrailer() { activeTrailer.value = null }
function onKey(e) { if (e.key === 'Escape') closeTrailer() }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

useHead({
  title: computed(() => entity.value ? `${entity.value.title} (${entity.value.release_date?.slice(0, 4) || ''})` : 'Movie'),
  meta: computed(() => {
    if (!entity.value) return []
    
    return [
      { name: 'description', content: entity.value.overview || `Watch ${entity.value.title} - ${entity.value.release_date?.slice(0, 4) || ''}` },
      { property: 'og:title', content: `${entity.value.title} (${entity.value.release_date?.slice(0, 4) || ''})` },
      { property: 'og:description', content: entity.value.overview || `Watch ${entity.value.title}` },
      { property: 'og:image', content: entity.value.poster_path ? posterUrl(entity.value.poster_path, 'w780') : '' },
      { property: 'og:type', content: 'video.movie' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${entity.value.title} (${entity.value.release_date?.slice(0, 4) || ''})` },
      { name: 'twitter:description', content: entity.value.overview || `Watch ${entity.value.title}` },
      { name: 'twitter:image', content: entity.value.poster_path ? posterUrl(entity.value.poster_path, 'w780') : '' }
    ]
  })
})

watch(entity, async (v) => {
  if (!v) return
  
  try {
    const [raw, vids] = await Promise.all([
      tmdb.movieDetail(v.id),
      tmdb.movieVideos(v.id)
    ])

    mediaBackdrops.value = (raw.images?.backdrops || []).slice(0,12).map(b => ({ image: backdropUrl(b.file_path,'w780'), name: b.iso_639_1 }))
    mediaPosters.value   = (raw.images?.posters || []).slice(0,12).map(p => ({ image: posterUrl(p.file_path,'w500'), name: p.iso_639_1 }))

    mediaVideos.value = (vids?.results || [])
      .filter(x => (x.site === 'YouTube' || x.site === 'Vimeo') && (x.type === 'Trailer' || x.type === 'Teaser'))
      .sort((a,b) => (Date.parse(b.published_at||'')||0) - (Date.parse(a.published_at||'')||0))
      .slice(0,12)
      .map(x => ({
        kind: 'video',
        key: x.key,
        site: x.site,
        type: x.type,
        name: x.name || x.type,
        published_at: x.published_at || '',
        image: x.site === 'YouTube' ? ytThumb(x.key) : (entity.value?.backdrop_path ? backdropUrl(entity.value.backdrop_path,'w780') : '')
      }))

    crewItems.value = (raw.credits?.crew || []).slice(0,24)

    const recs = [...(raw.recommendations?.results || []).slice(0,10)]
    const similar = (raw.similar?.results || []).filter(s => !recs.find(r => r.id === s.id)).slice(0,10)
    recItems.value = [...recs, ...similar]

    keywords.value = raw.keywords?.keywords || []

    const budget = raw.budget > 0 ? '$' + (raw.budget/1000000).toFixed(1) + 'M' : 'N/A'
    const revenue = raw.revenue > 0 ? '$' + (raw.revenue/1000000).toFixed(1) + 'M' : 'N/A'
    info.value = {
      status: raw.status || '',
      release: raw.release_date || '',
      runtime: raw.runtime ? `${raw.runtime} minutes` : '',
      budget,
      revenue,
      original_language: raw.original_language?.toUpperCase() || ''
    }
  } catch (e) {
    console.error('movie details load failed', e)
  }
}, { immediate: true })
</script>
