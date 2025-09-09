<template>
  <div class="w-full overflow-x-hidden no-scrollbar bg-zinc-100 text-white">
    <section class="relative  w-full min-h-[50vh] bg-cover bg-center" :style="{ backgroundImage: `url(${bg})` }">
      <div class="relative  lg:ml-12 lg:mr-12 p-4 sm:p-6 lg:p-8">
        <h1 class="ml-2 w-full text-3xl mt-20 sm:text-4xl lg:text-5xl font-bold leading-tight">
          Welcome.
        </h1>
        <h2 class="ml-3 mt-2 w-full text-lg sm:text-xl lg:text-base text-zinc-200 line-clamp-3 lg:line-clamp-none">
          Millions of movies, TV shows, and people to discover. Explore now.
        </h2>
        <SearchBar class="  mt-6 h-12 w-full" />
      </div>
    </section>

    <section class="relative px-4 sm:px-8 lg:px-20 py-8">
      
      <div class="flex flex-wrap items-center  gap-3 mb-4">
        <h2 class="text-2xl font-bold text-zinc-800">
          Trending
        </h2>
        <div class="flex gap-3">
          <button
            class=" xl:w-20 xl:h-8 sm:w-18 sm:h-10 md:w-19 md:h-11 lg:w-20 lg:h-12 px-3 py-1 rounded-full transition-colors"
            :class="trendKind === 'movie' ? 'bg-zinc-500 text-zinc-100' : 'bg-zinc-300 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-400'"
            @click="() => { trendKind = 'movie'; loadTrending() }">Movies</button>
          <button
            class=" xl:w-20 xl:h-8 sm:w-18 sm:h-10 md:w-19 md:h-11 lg:w-20 lg:h-12 px-3 py-1 rounded-full transition-colors"
            :class="trendKind === 'tv' ? 'bg-zinc-500 text-zinc-100' : 'bg-zinc-300 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-400'"
            @click="() => { trendKind = 'tv'; loadTrending() }">TV</button>
          <button
            class=" xl:w-20 xl:h-8 sm:w-18 sm:h-10 md:w-19 md:h-11 lg:w-20 lg:h-12 px-3 py-1 rounded-full transition-colors"
            :class="trendWindow === 'day' ? 'bg-zinc-500 text-zinc-100' : 'bg-zinc-300 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-400'"
            @click="() => { trendWindow = 'day'; loadTrending() }">Day</button>
          <button
            class="xl:w-20 xl:h-8 sm:w-18 sm:h-10 md:w-19 md:h-11 lg:w-20 lg:h-12 px-3 py-1 rounded-full transition-colors"
            :class="trendWindow === 'week' ? 'bg-zinc-500 text-zinc-100' : 'bg-zinc-300 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-400'"
            @click="() => { trendWindow = 'week'; loadTrending() }">Week</button>
        </div>
        </div>
        
      <div class="relative no-scrollbar">
        <div ref="trendTrack"
          class="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pr-2 touch-pan-x">
          <div v-for="item in trendItems" :key="item.id"
            class="snap-start min-w-[160px] sm:min-w-[185px] lg:min-w-[200px]">
            <div class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800 shadow hover:shadow-lg">
              <NuxtLink :to="`/movie/${item.id}`" class="block w-full h-full" :aria-label="`Open ${item.title||item.name}`">
                <img :src="posterUrl(item.poster_path, 'w342')" :alt="item.title || item.name"
                  class="w-full h-full object-cover transition-transform duration-300" loading="lazy" />
          </NuxtLink>
              <button class="absolute h-8 w-8 top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-black/80 text-white"
                @click.stop="toggleFav(item, trendKind)" :aria-pressed="isItemFav(item, trendKind)" title="Favori">
                <span v-if="isItemFav(item, trendKind)">★</span>
                <span v-else>☆</span>
              </button>
              <div class="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-1.5 py-2 rounded-full w-8 h-8">
                {{ Math.round((item.vote_average || 0)) * 10 }}%
              </div>
            </div>
            <div class="mt-2 text-zinc-800 text-sm font-medium line-clamp-1">
              {{ item.title || item.name }}
            </div>
            <div class="text-xs text-zinc-500">
              {{ formatDate(item.release_date || item.first_air_date) }}
            </div>
          </div>
        </div>
        
        <button type="button" v-if="trendItems.length > 0" class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center
h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 text-white hover:bg-black transition
" @click="scrollTrendLeft" aria-label="Scroll left">←
</button>

<button type="button" v-if="trendItems.length > 0" class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center
h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition
" @click="scrollTrendRight" aria-label="Scroll right">→</button>
      </div>
    </section>

    <section class="px-4 sm:px-8 lg:px-20 py-8" :style="{backgroundImage: `url(${bg1})` }">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 class="text-2xl font-bold text-white">Latest Movie Trailers</h2>
        <p v-if="trailerLoading" class="text-white text-sm">Loading trailers…</p>
        <p v-else-if="trailerError" class="text-red-500 text-sm">{{ trailerError }}</p>
      </div>

      <div class="relative no-scrollbar">
        <button v-if="trailerItems.length > 0" type="button" class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center
             h-10 w-10 rounded-full bg-black/50 text-zinc-300 hover:bg-black/70 transition" @click="scrollTrailerLeft"
          aria-label="Scroll left">←</button>

        <div ref="trailerTrack"
          class="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pr-2 touch-pan-x">
          <div v-for="item in trailerItems" :key="item.id"
            class="snap-start min-w-[256px] md:min-w-[384px] lg:min-w-[512px]">
            <div class="relative w-full overflow-hidden rounded-lg bg-zinc-800 shadow">
              <div class="aspect-[16/9] w-full">
                <img :src="trailerThumb(item)" :alt="(item.title || item.name) + ' poster'"
                  class="w-full h-full object-cover" loading="lazy"></img>
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 pointer-events-none"></div>
                <button type="button" @click="openTrailer(item)" class="absolute inset-0 grid place-items-center"
                  aria-label="Play trailer">
                  <span class="inline-grid place-items-center rounded-full bg-white/90 backdrop-blur
                 w-14 h-14 md:w-16 md:h-16 shadow ring-1 ring-black/10 hover:scale-105 transition">
                    <svg viewBox="0 0 24 24" class="w-6 h-6 fill-zinc-900">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </div>

              <div class="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-1.5 py-2 rounded-full">
                {{ Math.round((item.vote_average || 0) * 10) }}%
              </div>
            </div>

            <div class="mt-2 text-zinc-200 text-sm font-medium line-clamp-1">
              {{ item.title || item.name }}
            </div>
            <div class="text-xs text-zinc-300">
              {{ formatDate(item.release_date || item.first_air_date) }}
            </div>
          </div>
        </div>

        <button v-if="trailerItems.length > 0" type="button" class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center
             h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition" @click="scrollTrailerRight"
          aria-label="Scroll right">→</button>
      </div>
      <div v-if="activeTrailer"
        class="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog"
        aria-modal="true">
        <div class="relative w-full max-w-5xl">
          <button aria-label="Close" type="button" @click="closeTrailer"
            class="absolute h-8 w-8 -top-10 right-0 bg-white/20 hover:bg-white/30 text-white  rounded-full px-2 py-1 text-sm">✕</button>
          <div class="aspect-[16/9] w-full rounded-lg overflow-hidden shadow">
            <iframe class="w-full h-full" :src="videoEmbedUrl(activeTrailer.trailer, { fullUI: true })"
              :title="(activeTrailer.title || activeTrailer.name) + ' trailer'" frameborder="0"
              allow="autoplay; encrypted-media; picture-in-picture; accelerometer; clipboard-write; gyroscope"
              allowfullscreen></iframe>
          </div>
          <div class="mt-3 flex items-center justify-between text-zinc-200 text-sm">
            <div class="font-medium">{{ activeTrailer.title || activeTrailer.name }}</div>
            <div class="opacity-75"> {{ formatDate(activeTrailer.release_date || activeTrailer.first_air_date) }} </div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 sm:px-8 lg:px-20 py-8">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <h2 class="text-2xl font-bold text-zinc-800">Popular</h2>
        <div class="flex gap-3">
          <button class="xl:w-20 xl:h-8 sm:w-18 sm:h-10 md:w-19 md:h-11 lg:w-20 lg:h-12 px-3 py-1 rounded-full transition-colors" :class="popKind === 'movie'
            ? 'bg-zinc-500 text-zinc-100' : 'bg-zinc-300 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-400'" @click="() => { popKind = 'movie'; loadPopular() }">
            Movies
          </button>
          <button class="xl:w-20 xl:h-8 sm:w-18 sm:h-10 md:w-19 md:h-11 lg:w-20 lg:h-12 px-3 py-1 rounded-full transition-colors" :class="popKind === 'tv'
            ? 'bg-zinc-500 text-zinc-100' : 'bg-zinc-300 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-400'" @click="() => { popKind = 'tv'; loadPopular() }">
            TV
          </button>
        </div>
      </div>
      <div class="relative no-scrollbar">
        <button v-if="popItems.length > 0" class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center
h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition" @click="scrollPopLeft(popTrack)"
aria-label="Scroll left">←</button>
        
        <div ref="popTrack"
          class="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pr-2 touch-pan-x">
          <div v-for="item in popItems" :key="item.id"
            class="snap-start min-w-[160px] sm:min-w-[185px] lg:min-w-[200px]">
            <div class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800 shadow hover:shadow-lg">
              <NuxtLink :to="`/movie/${item.id}`" class="block w-full h-full" :aria-label="`Open ${item.title||item.name}`">
                <img :src="posterUrl(item.poster_path, 'w342')" :alt="item.title || item.name"
                  class="w-full h-full object-cover transition-transform duration-300" loading="lazy" />
          </NuxtLink>
              
                 <button class="absolute h-8 w-8 top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-black/80 text-white"
                @click.stop="toggleFav(item, trendKind)" :aria-pressed="isItemFav(item, trendKind)" title="Favori">
                <span v-if="isItemFav(item, trendKind)">★</span>
                <span v-else>☆</span>
              </button>
              <div class="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-1.5 py-2 rounded-full">
                {{ Math.round((item.vote_average || 0) * 10) }}%
              </div>
            </div>
            <div class="mt-2 text-zinc-800 text-sm font-medium line-clamp-1">
              {{ item.title || item.name }}
            </div>
            <div class="text-xs text-zinc-500">
              {{ formatDate(item.release_date || item.first_air_date) }}
        </div>
      </div>
    </div>

        <button v-if="popItems.length > 0" class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center
h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
@click="scrollPopRight(popTrack)" aria-label="Scroll right">→</button>
      </div>
    </section>   
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useFavoritesStore } from '../stores/favorites'
import { useTmdbClient } from '../composables/useTmdbClient'
import bg from '../assets/bg.jpg'
import bg1 from '../assets/bg1.jpg'

import '../style.css'
import SearchBar from '../components/SearchBar.vue'

const { tmdb, posterUrl, backdropUrl } = useTmdbClient()

const fav = useFavoritesStore()
fav.init()

function isItemFav(item) {
  return fav.isFav('movie', item.id)
}

function toggleFav(item) {
  fav.toggle({
    id: item.id,
    media_type: 'movie',
    title: item.title || item.name || '',
    poster_path: item.poster_path ?? item.backdrop_path ?? ''
  })
}

async function loadTrending() {
  trendLoading.value = true
  trendError.value = ''
  try {
    const isMovie = trendKind.value === 'movie'
    const data = isMovie ? await tmdb.movieTrending(trendWindow.value, 1)
      : await tmdb.tvTrending(trendWindow.value, 1)

    trendItems.value = Array.isArray(data?.results) ? data.results : []
  } catch (e) {
    trendError.value = 'Could not catch trending data'
    console.error(e)
  } finally {
    trendLoading.value = false
  }
}

async function loadPopular() {
  popLoading.value = true
  popError.value = ''
  try {
    const isMovie = popKind.value === 'movie'
    const data = isMovie ? await tmdb.moviesPopular(1)
      : await tmdb.tvPopular(1)

    popItems.value = Array.isArray(data?.results) ? data.results : []
  } catch (e) {
    popError.value = 'Could not catch popular data'
    console.error(e)
  } finally {
    popLoading.value = false
  }
}

function formatDate(dateStr, locale = 'en-EN') {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(d)
}

const trendTrack = ref(null)
const popTrack = ref(null)

function scrollTrendLeft() {
  const el = trendTrack.value
  if (!el) return
  el.scrollBy({ left: -el.clientWidth * 0.9, behavior: 'smooth' })
}
function scrollTrendRight() {
  const el = trendTrack.value
  if (!el) return
  el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' })
}

function scrollPopLeft() {
  const el = popTrack.value
  if (!el) return
  el.scrollBy({ left: -el.clientWidth * 0.9, behavior: 'smooth' })
}
function scrollPopRight() {
  const el = popTrack.value
  if (!el) return
  el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' })
}

const trendKind = ref('movie')
const trendWindow = ref('day')
const trendItems = ref([])
const trendLoading = ref(false)
const trendError = ref('')

const popKind = ref('movie')
const popItems = ref([])
const popLoading = ref(false)
const popError = ref('')

const trailerItems = ref([])
const trailerLoading = ref(false)
const trailerError = ref('')
const trailerTrack = ref(null)

const activeTrailer = ref(null)

function openTrailer(item) { activeTrailer.value = item }
function closeTrailer() { activeTrailer.value = null }

function onKey(e) { if (e.key === 'Escape') closeTrailer() }

onMounted(() => {
  window.addEventListener('keydown', onKey)
  loadTrending()
  loadPopular()
  loadLatestTrailers()
})

onUnmounted(() => window.removeEventListener('keydown', onKey))

watch(activeTrailer, (v) => {
  document?.body && (document.body.style.overflow = v ? 'hidden' : '')
})

function trailerThumb(item) {
  return backdropUrl(item.backdrop_path, 'w780') || posterUrl(item.poster_path, 'w342')
}

function videoEmbedUrl(v, { fullUI = false } = {}) {
  if (!v) return ''
  if (v.site === 'YouTube') {
    const base = `https://www.youtube-nocookie.com/embed/${v.key}`
    return fullUI
      ? `${base}?autoplay=1&controls=1&modestbranding=0&rel=1&fs=1`  
      : `${base}?autoplay=1&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3`
  }
  if (v.site === 'Vimeo') {
    return `https://player.vimeo.com/video/${v.key}?autoplay=1&title=0&byline=0&portrait=0`
  }
  return ''
}

function scrollTrailerLeft() {
  const el = trailerTrack.value
  if (!el) return
  el.scrollBy({ left: -Math.floor(el.clientWidth * 0.9), behavior: 'smooth' })
}

function scrollTrailerRight() {
  const el = trailerTrack.value
  if (!el) return
  el.scrollBy({ left: Math.floor(el.clientWidth * 0.9), behavior: 'smooth' })
}

async function loadLatestTrailers() {
  trailerLoading.value = true
  trailerError.value = ''
  try {
    const [trend, upcoming] = await Promise.all([
      tmdb.movieTrending('day', 1),
      tmdb.moviesUpcoming(1),
    ])

    const pool = [...(trend?.results ?? []), ...(upcoming?.results ?? [])]
    const seen = new Set()
    const movies = pool.filter(m => {
      if (!m || seen.has(m.id)) return false
      seen.add(m.id); return true
    }).slice(0, 24)

    const results = await Promise.all(movies.map(async (m) => {
      try {
        const vids = await tmdb.movieVideos(m.id)
        const list = Array.isArray(vids?.results) ? vids.results : []

        let trailers = list.filter(v => v.type === 'Trailer' && (v.site === 'YouTube' || v.site === 'Vimeo'))
        if (trailers.length === 0) {
          trailers = list.filter(v => v.type === 'Teaser' && (v.site === 'YouTube' || v.site === 'Vimeo'))
        }

        const score = (v) => (v.official ? 2 : 0) + (v.site === 'YouTube' ? 1 : 0)
        const pick = trailers.sort((a, b) => {
          const t = (Date.parse(b.published_at || '') || 0) - (Date.parse(a.published_at || '') || 0)
          return t !== 0 ? t : (score(b) - score(a))
        })[0]

        if (!pick) return null
        return { ...m, trailer: pick }
      } catch {
        return null
      }
    }))

    trailerItems.value = results
      .filter(Boolean)
      .sort((a, b) => (Date.parse(b.trailer?.published_at || '') || 0) - (Date.parse(a.trailer?.published_at || '') || 0))
      .slice(0, 12)
  } catch (e) {
    trailerError.value = 'Could not fetch latest trailers.'
    console.error(e)
  } finally {
    trailerLoading.value = false
  }
}

function externalWatchUrl(v) {
  if (!v) return ''
  if (v.site === 'YouTube') return `https://www.youtube.com/watch?v=${v.key}`
  if (v.site === 'Vimeo') return `https://vimeo.com/${v.key}`
  return ''
}
</script>
