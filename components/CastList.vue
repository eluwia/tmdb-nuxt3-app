<template>
  <section>
    <h2 class="text-lg font-semibold mb-2">Top cast</h2>
    <div class="grid" :class="gridClass">
      <div v-for="c in cast" :key="c.id" class="p-2">
        <NuxtLink :to="`/person/${c.id}`" class="block focus:outline-none focus:ring-2">
          <div class="aspect-[2/3] bg-gray-100 rounded-md overflow-hidden">
            <img v-if="c.profile_path" :src="imgUrl(c.profile_path,'w154')" :alt="c.name" loading="lazy" decoding="async" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gray-200"></div>
          </div>
          <div class="mt-2 text-sm text-zinc-800 dark:text-zinc-200">{{ c.name }}</div>
          <div class="text-xs text-zinc-500">{{ c.character || c.job || '' }}</div>
  </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useTmdbClient } from '../composables/useTmdbClient'

const { profileUrl } = useTmdbClient()
const props = defineProps({ cast: { type: Array, default: () => [] } })
const gridClass = 'grid-cols-auto-fit gap-2'
function imgUrl(p,s='w154'){ return profileUrl(p,s) }
function externalUrl(type,id){ return `https://www.themoviedb.org/${type}/${id}` }
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem,1fr)); }
</style>