<script setup>
const props = defineProps({ item: { type: Object, required: true } })
const { profileUrl } = useTmdb()
function roleLine(p) {
  const dept = p.known_for_department || ''
  const titles = (p.known_for || []).slice(0, 2).map(k => k.title || k.name).filter(Boolean)
  if (!dept && !titles.length) return ''
  if (dept && titles.length) return `${dept} • ${titles.join(', ')}`
  return dept || titles.join(', ')
}
</script>

<template>
  <div class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 p-2">
    <NuxtLink :to="`/person/${item.id}`" class="block group">
      <div class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800 shadow group-hover:shadow-lg">
        <img v-if="item.profile_path" :src="profileUrl(item.profile_path, 'w342')" :alt="item.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        <div v-else class="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
      </div>
      <div class="mt-2 text-zinc-800 text-sm font-medium line-clamp-1">
        {{ item.name }}
      </div>
      <div class="text-xs text-zinc-500 line-clamp-2 border-t border-zinc-200 pt-1">
        {{ roleLine(item) }}
      </div>
    </NuxtLink>
  </div>
</template>
