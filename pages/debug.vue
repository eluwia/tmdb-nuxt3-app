<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Debug Page</h1>
    
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">API Test</h2>
      <button @click="testAPI" class="bg-blue-500 text-white px-4 py-2 rounded">
        Test API
      </button>
      <div v-if="apiResult" class="mt-2 p-4 bg-gray-100 rounded">
        <pre>{{ JSON.stringify(apiResult, null, 2) }}</pre>
      </div>
      <div v-if="apiError" class="mt-2 p-4 bg-red-100 text-red-800 rounded">
        Error: {{ apiError }}
      </div>
    </div>
    
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">Environment</h2>
      <p>TMDB Key exists: {{ !!config.tmdbKey }}</p>
      <p>Image Base: {{ config.public.imgBase }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const apiResult = ref(null)
const apiError = ref('')

async function testAPI() {
  try {
    const result = await $fetch('/api/tmdb/movie/popular?page=1')
    apiResult.value = result
    apiError.value = ''
  } catch (error) {
    apiError.value = error.message
    apiResult.value = null
  }
}
</script>
