<script setup>
import { useTmdbClient } from '../composables/useTmdbClient'
import { computed } from 'vue'

const { posterUrl } = useTmdbClient()

const props = defineProps({
  item: { type: Object, required: true },
  isFav: { type: Function, required: true },
  toggleFav: { type: Function, required: true },
})

function formatDate(dateStr, locale = 'en-US') {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
}

const isMovie = !props.item.media_type || props.item.media_type === 'movie'
const linkTo = computed(() => {
  const t = props.item.media_type || (props.item.title ? 'movie' : (props.item.first_air_date ? 'tv' : 'movie'))
  if (t === 'person') return `/person/${props.item.id}`
  if (t === 'tv') return `/tv/${props.item.id}`
  return `/movie/${props.item.id}`
})
</script>

<template>
  <div v-if="isMovie" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 p-2">
    <div class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800 shadow hover:shadow-lg transform transition-transform hover:scale-105">
      <NuxtLink :to="linkTo" class="block w-full h-full" :aria-label="`Open ${item.title||item.name} details`">
        <NuxtImg
          v-if="item.poster_path"
          :src="posterUrl(item.poster_path, 'w342')"
          :alt="item.title || item.name"
          class="w-full h-full object-cover"
          loading="lazy"
          format="webp"
          quality="80"
          sizes="sm:50vw md:33vw lg:20vw xl:16vw"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
        <div class="absolute left-2 top-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{{ Math.round((item.vote_average||0)*10) }}%</div>
        <div class="absolute left-2 bottom-2 right-2 text-white text-sm font-medium line-clamp-2">{{ item.title || item.name }}</div>
      </NuxtLink>
      <button
        class="absolute h-8 w-8 top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-black/80 text-white"
        @click.stop="toggleFav(item)"
        :aria-pressed="isFav(item)"
        title="Favorite"
      >
        <span v-if="isFav(item)">★</span>
        <span v-else>☆</span>
      </button>
      
      
    </div>
    <div class="mt-2">
      <div class="text-zinc-800 text-sm font-medium line-clamp-1">{{ item.title || item.name }}</div>
      <div class="text-xs text-zinc-500">{{ formatDate(item.release_date || item.first_air_date) }}</div>
    </div>
  </div>
  <div v-else class="hidden"></div>
</template>