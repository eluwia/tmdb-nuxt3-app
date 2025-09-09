<template>
  <article class="card rounded-2xl shadow-md p-4 md:p-6 bg-white/90 dark:bg-zinc-900/90">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="col-span-1">
        <div class="aspect-[2/3] overflow-hidden rounded-xl bg-gray-100">
          <img v-if="img" :src="img" :alt="alt" class="w-full h-full object-cover" loading="lazy" decoding="async" />
          <div v-else class="w-full h-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
      <div class="md:col-span-2">
        <h1 id="detail-title" class="text-2xl font-semibold mb-2 truncate">{{ title }}</h1>
        <div class="text-sm text-zinc-600 dark:text-zinc-300 mb-3">{{ subtitle }}</div>

        <div class="mb-4">
          <slot name="meta"></slot>
        </div>

        <div class="prose text-zinc-800 dark:text-zinc-200">
          <slot name="overview"></slot>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  img: String,
  alt: String
})
</script>

<style scoped>

</style>
