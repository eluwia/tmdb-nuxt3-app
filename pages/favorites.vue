<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between gap-3 mb-6">
      <h1 class="text-2xl font-bold text-zinc-800">My Favorites</h1>
      <div class="flex items-center gap-2">
        <input v-model="q" type="search" placeholder="Search favorites" class="px-3 py-2 rounded border border-zinc-300 text-sm w-48" />
        <div class="flex gap-2">
          <button class="px-3 py-1 rounded-full text-sm" :class="kind==='all' ? 'bg-zinc-600 text-white' : 'bg-zinc-300 text-zinc-700 hover:bg-zinc-400'" @click="kind='all'">All</button>
          <button class="px-3 py-1 rounded-full text-sm" :class="kind==='movie' ? 'bg-zinc-600 text-white' : 'bg-zinc-300 text-zinc-700 hover:bg-zinc-400'" @click="kind='movie'">Movies</button>
          <button class="px-3 py-1 rounded-full text-sm" :class="kind==='tv' ? 'bg-zinc-600 text-white' : 'bg-zinc-300 text-zinc-700 hover:bg-zinc-400'" @click="kind='tv'">TV</button>
        </div>
      </div>
    </div>

    <div v-if="!items.length" class="text-zinc-500">No favorites yet.</div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="it in items" :key="it.media_type + ':' + it.id" class="group relative">
        <NuxtLink :to="it.media_type==='movie' ? `/movie/${it.id}` : `/tv/${it.id}`" class="block">
          <div class="aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-200">
            <img v-if="it.poster_path" :src="posterUrl(it.poster_path, 'w342')" :alt="it.title" class="w-full h-full object-cover group-hover:opacity-80 transition" loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center text-zinc-500">No Image</div>
          </div>
          <div class="mt-2 text-sm text-zinc-800 font-medium line-clamp-1">{{ it.title }}</div>
          <div class="text-xs text-zinc-500 uppercase">{{ it.media_type }}</div>
        </NuxtLink>
        <button class="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 text-white hidden group-hover:flex items-center justify-center" @click.prevent="removeOne(it)" title="Remove">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFavoritesStore } from '../stores/favorites'

useHead({
  title: 'My Favorites'
})

const fav = useFavoritesStore()
onMounted(() => {
  fav.init()
})

const { posterUrl } = useTmdb()

const q = ref('')
const kind = ref('all')

const items = computed(() => {
  const src = fav.items || []
  const filteredByType = kind.value === 'all' ? src : src.filter(i => i.media_type === kind.value)
  const t = (q.value || '').toLowerCase()
  return t ? filteredByType.filter(i => (i.title || '').toLowerCase().includes(t)) : filteredByType
})

function removeOne(item) {
  fav.remove(item.media_type, item.id)
}
</script>
