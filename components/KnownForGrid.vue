<template>
  <section>
    <h2 class="text-lg font-semibold mb-2">Known for</h2>
    <div class="grid grid-cols-auto-fit gap-2">
      <div v-for="k in items" :key="k.credit_id || k.id" class="p-2">
        <NuxtLink :to="navTo(k)" class="block focus:outline-none focus:ring-2">
          <div class="aspect-[2/3] bg-gray-100 rounded-md overflow-hidden">
            <img v-if="k.poster_path || k.profile_path" :src="imgUrl(k.poster_path||k.profile_path,'w154')" :alt="k.title || k.name" loading="lazy" decoding="async" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gray-200"></div>
          </div>
          <div class="mt-2 text-sm text-zinc-800 dark:text-zinc-200">{{ k.title || k.name }}</div>
  </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ items: { type: Array, default: () => [] } })
const { posterUrl, profileUrl } = useTmdb()
function imgUrl(p,s='w154'){ return p && p.startsWith('/') ? posterUrl(p,s) : profileUrl(p,s) }
function navTo(k){
  const type = k.media_type || (k.title ? 'movie' : (k.first_air_date ? 'tv' : 'movie'))
  if (type === 'tv') return `/tv/${k.id}`
  if (type === 'person') return `/person/${k.id}`
  return `/movie/${k.id}`
}
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem,1fr)); }
</style>
