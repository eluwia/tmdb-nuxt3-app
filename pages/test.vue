<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Test Page</h1>
    
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">Environment Test</h2>
      <p>TMDB Key: {{ config.tmdbKey ? 'Set' : 'Not Set' }}</p>
      <p>Image Base: {{ config.public.imgBase }}</p>
    </div>
    
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">API Test</h2>
      <button @click="testAPI" class="bg-blue-500 text-white px-4 py-2 rounded mb-2">
        Test Popular Movies API
      </button>
      <div v-if="loading" class="text-blue-600">Loading...</div>
      <div v-if="error" class="text-red-600">Error: {{ error }}</div>
      <div v-if="result" class="text-green-600">Success! Found {{ result.results?.length || 0 }} movies</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const loading = ref(false)
const error = ref('')
const result = ref(null)

async function testAPI() {
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    const response = await $fetch('/api/tmdb/movie/popular?page=1')
    result.value = response
  } catch (err) {
    error.value = err.message || 'Unknown error'
  } finally {
    loading.value = false
  }
}
</script>
