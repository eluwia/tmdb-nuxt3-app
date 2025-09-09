<template> 
  <div class="w-full">
    <section class="relative w-full text-zinc-100">
      <div class="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-600"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
  <div v-if="isLoading" class="space-y-4">
          <div class="animate-pulse h-64 bg-zinc-900/80  rounded-xl"></div>
          <div class="h-6 bg-zinc-900/80 rounded w-1/3"></div>
  </div>

        <div v-else-if="error" class="text-red-400 font-medium">{{ error }}</div>

        <div v-else-if="entity" class="flex flex-col md:flex-row items-start gap-0">
          <div ref="posterWrap" class="w-56 md:w-64 lg:w-72 shrink-0">
            <div class="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900">
              <img
                v-if="entity.profile_path"
                :src="profileUrl(entity.profile_path,'w780')"
                :alt="entity.name"
                class="w-full h-full object-cover"
                loading="lazy"
                @load="syncBoxMinHeight" />
              <div v-else class="w-full h-full bg-zinc-800"></div>
            </div>
          </div>

          <div class="relative flex-1 min-w-0 md:ml-0">
<div class="absolute inset-0 rounded-tr-xl rounded-br-xl bg-zinc-00/40" :style="{ minHeight: boxMinHeight + 'px' }"></div>
            <div class="relative p-6 md:p-8">
              <h1 class="text-3xl md:text-5xl font-bold tracking-tight">{{ entity.name }}</h1>
              <p v-if="entity.known_for_department" class="mt-2 text-zinc-300">{{ entity.known_for_department }}</p>

              <div class="mt-8 grid md:grid-cols-[2fr,1fr] gap-8">
                <div class="space-y-4">
                  <h3 class="text-xl font-semibold">Biography</h3>
                  <p class="text-zinc-200/90 leading-relaxed whitespace-pre-line">
                    {{ entity.biography || 'No biography available.' }}
                  </p>
            </div>

                <div class="space-y-4">
                  <h4 class="text-lg font-semibold">Personal Info</h4>
                  <dl class="space-y-3 text-sm">
                    <div class="grid grid-cols-2 gap-2">
                      <dt class="text-zinc-300">Born</dt>
                      <dd class="font-medium text-zinc-100">{{ entity.birthday || '—' }}</dd>
                    </div>
                    <div class="grid grid-cols-2 gap-2" v-if="entity.place_of_birth">
                      <dt class="text-zinc-300">Place of Birth</dt>
                      <dd class="font-medium text-zinc-100">{{ entity.place_of_birth }}</dd>
                </div>
                    <div class="grid grid-cols-2 gap-2" v-if="entity.deathday">
                      <dt class="text-zinc-300">Died</dt>
                      <dd class="font-medium text-zinc-100">{{ entity.deathday }}</dd>
              </div>
                    <div class="grid grid-cols-2 gap-2">
                      <dt class="text-zinc-300">Known For</dt>
                      <dd class="font-medium text-zinc-100">{{ entity.known_for_department || '—' }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div> 
        </div>

        <div v-else class="text-zinc-400">No data</div>
      </div>
    </section>

    <section class="w-full bg-zinc-600 text-zinc-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h3 class="text-lg font-semibold mb-3">Known For</h3>
        <div class="relative">
          <button
            v-if="knownForItemsLocal.length"
            class="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            @click="scrollKnownLeft">←</button>

          <div
            ref="knownTrack"
            class="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pr-10 touch-pan-x">
            <div
              v-for="k in knownForItemsLocal"
              :key="k.id + '-' + (k.media_type||'')"
              class="snap-start">
              <NuxtLink :to="knownLink(k)" class="block">
                <div class="w-[180px] h-[270px] rounded-lg bg-zinc-800 overflow-hidden">
                  <img
                    v-if="k.poster_path"
                    :src="posterUrl(k.poster_path,'w342')"
                    class="w-full h-full object-cover"
                    loading="lazy" />
                  <div v-else class="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                </div>
                <div class="mt-2 w-[180px] text-sm font-medium text-zinc-200 line-clamp-2">
                  {{ k.title || k.name }}
              </div>
              </NuxtLink>
              </div>
          </div>

          <button
            v-if="knownForItemsLocal.length"
            class="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            @click="scrollKnownRight">→</button>
            </div>
          </div>
        </section>
      </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useDetail } from '../../composables/useDetail'
import { useTmdbClient } from '../../composables/useTmdbClient'

const { tmdb, profileUrl, posterUrl } = useTmdbClient()

const route = useRoute()
const id = route.params.id
const { entity, isLoading, error } = useDetail('person', id)

const posterWrap = ref(null)
const boxMinHeight = ref(0)
function syncBoxMinHeight() {
  const el = posterWrap.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  boxMinHeight.value = Math.max(0, rect.height)
}
function onResize() { syncBoxMinHeight() }
onMounted(() => {
  nextTick(syncBoxMinHeight)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

const knownForItemsLocal = ref([])
let lastLoadedId = null
async function loadKnownFor(person) {
  if (!person?.id) return
  if (lastLoadedId === person.id && knownForItemsLocal.value.length) return
  const list = Array.isArray(person.known_for) ? person.known_for : []
  if (list.length) {
    knownForItemsLocal.value = list
    lastLoadedId = person.id
    return
  }
  try {
    const raw = await tmdb.personDetail(person.id)
    const comb = raw.combined_credits || {}
    const items = [...(comb.cast || []), ...(comb.crew || [])]
      .sort((a,b) => (b.popularity||0) - (a.popularity||0))
      .slice(0, 20)
    knownForItemsLocal.value = items
    lastLoadedId = person.id
  } catch {}
}

watchEffect(() => {
  if (!isLoading.value && entity.value) {
    useHead({
      title: `${entity.value.name} - TMDB`
    })
    
    loadKnownFor(entity.value)
    nextTick(syncBoxMinHeight)
  }
})
watch(() => route.params.id, () => {
  knownForItemsLocal.value = []
  lastLoadedId = null
})

const knownTrack = ref(null)
function scroll(elRef, amount = null) {
  const el = elRef && elRef.value
  if (!el) return
  const delta = amount ?? Math.floor(el.clientWidth * 0.9)
  el.scrollBy({ left: delta, behavior: 'smooth' })
}
function scrollKnownLeft() { scroll(knownTrack, -Math.floor((knownTrack.value?.clientWidth || 0) * 0.9)) }
function scrollKnownRight() { scroll(knownTrack, Math.floor((knownTrack.value?.clientWidth || 0) * 0.9)) }

function knownLink(k) {
  const mt = k.media_type || (k.title ? 'movie' : 'tv')
  return mt === 'tv'
    ? `/tv/${k.id}`
    : `/movie/${k.id}`
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>