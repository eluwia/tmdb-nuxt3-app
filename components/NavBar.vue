<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import logo from '../assets/bw-logo.svg'

const isOpen = ref(false)
function toggle() { isOpen.value = !isOpen.value }
function closeMenu() { isOpen.value = false }
const openDesktop = ref(null)
const openSection = ref(null)

const route = useRoute()
if (process.client) {
  watch(() => route.fullPath, () => closeMenu())
}

function toggleSection(name) {
  openSection.value = openSection.value === name ? null : name
}
</script>

<template>
  <nav class="no-scrollbar sticky top-0 z-[200] bg-zinc-900 h-64px text-white border-b border-zinc-900 backdrop-blur supports-[backdrop-filter]:backdrop-blur px-4 sm:px-6" @keydown.esc="closeMenu">
    <div class="h-14 max-w-screen-xl px-2 sm:px-6 mx-auto flex items-center justify-between">
      <NuxtLink to="/" class="2xl:-mx-16 xl:mx-8 lg:mx-8 flex items-center">
        <img :src="logo" alt="Site logo" class="block w-auto h-4 sm:h-5 md:h-5 lg:h-5 xl:h-6 2xl:h-6 object-contain shrink-0 select-none" />
      </NuxtLink>

      <div class="hidden lg:flex items-center gap-6 bg-zinc-900">
        <NuxtLink to="/favorites" class="inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-800" title="Favorites">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.176 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span>Favorites</span>
        </NuxtLink>

        <div class="relative group" @mouseenter="openDesktop = 'movies'" @mouseleave="openDesktop = null">
          <button class="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800">Movies <span class="text-xs opacity-70">▾</span></button>
          <div class="absolute left-0 top-full h-2 w-56"></div>
          <div class="absolute left-0 top-full w-56 rounded-md border border-zinc-700 bg-zinc-900 shadow-xl transition z-[300]" :class="openDesktop === 'movies' ? 'opacity-100 pointer-events-auto translate-y-1' : 'opacity-0 pointer-events-none -translate-y-1'">
            <NuxtLink to="/movies/popular" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">Popular Movies</NuxtLink>
            <NuxtLink to="/movies/top-rated" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">Top Rated Movies</NuxtLink>
            <NuxtLink to="/movies/upcoming" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">Upcoming Movies</NuxtLink>
            <NuxtLink to="/movies/now-playing" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">Now Playing</NuxtLink>
          </div>
        </div>
        
        <div class="relative group" @mouseenter="openDesktop = 'tv'" @mouseleave="openDesktop = null">
          <button class="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800">TV Shows <span class="text-xs opacity-70">▾</span></button>
          <div class="absolute left-0 top-full h-2 w-56"></div>
          <div class="absolute left-0 top-full w-56 rounded-md border border-zinc-700 bg-zinc-900 shadow-xl transition z-[300]" :class="openDesktop === 'tv' ? 'opacity-100 pointer-events-auto translate-y-1' : 'opacity-0 pointer-events-none -translate-y-1'">
            <NuxtLink to="/tv/popular" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">Popular TV Shows</NuxtLink>
            <NuxtLink to="/tv/top-rated" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">Top Rated TV Shows</NuxtLink>
            <NuxtLink to="/tv/on-air" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">TV Shows On The Air</NuxtLink>
          </div>
        </div>
        
        <div class="relative group" @mouseenter="openDesktop = 'people'" @mouseleave="openDesktop = null">
          <button class="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-700">People <span class="text-xs opacity-70">▾</span></button>
          <div class="absolute left-0 top-full h-2 w-56"></div>
          <div class="absolute left-0 top-full w-56 rounded-md border border-zinc-700 bg-zinc-900 shadow-xl transition z-[300]" :class="openDesktop === 'people' ? 'opacity-100 pointer-events-auto translate-y-1' : 'opacity-0 pointer-events-none -translate-y-1'">
            <NuxtLink to="/people/popular-people" class="block px-3 py-2 text-sm hover:bg-zinc-800 rounded">People</NuxtLink>
          </div>
        </div>
      </div>

      <button class="lg:hidden p-2 rounded-full hover:bg-zinc-800" @click="toggle" :aria-expanded="isOpen" aria-label="Open menu" aria-controls="mobile-drawer">
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </nav>

  <div id="mobile-drawer" class="text-zinc-100 fixed top-0 pt-10 right-0 h-screen w-80 max-w-[85vw] bg-zinc-900 z-[300] transform transition-transform duration-300 ease-out lg:hidden" :class="isOpen ? 'translate-x-0' : 'translate-x-full'" role="dialog" aria-modal="true">
    <button class="absolute top-2 right-2 p-2 h-10 w-10 rounded-full hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-sky-500" @click="closeMenu" aria-label="Close menu">✕</button>
    <div class="h-full overflow-y-auto p-4">
      <NuxtLink to="/favorites" class="block py-3 mb-2 text-[17px] font-medium" @click="closeMenu">
        <span class="text-amber-300 inline-flex items-center gap-2"> ★<span>Favorites</span></span>
      </NuxtLink>
      
      <button class="w-full flex items-center justify-between py-3" :aria-expanded="openSection === 'movies'" aria-controls="menu-movies" @click="toggleSection('movies')">
        <span class="font-medium">Movies</span>
        <span class="text-xs opacity-70">{{ openSection === 'movies' ? '▲' : '▼' }}</span>
      </button>
      <div id="menu-movies" class="pl-4 space-y-2 transition-all duration-300" v-show="openSection === 'movies'">
        <NuxtLink to="/movies/popular" class="block py-2" @click="closeMenu">Popular Movies</NuxtLink>
        <NuxtLink to="/movies/top-rated" class="block py-2" @click="closeMenu">Top Rated Movies</NuxtLink>
        <NuxtLink to="/movies/upcoming" class="block py-2" @click="closeMenu">Upcoming Movies</NuxtLink>
        <NuxtLink to="/movies/now-playing" class="block py-2" @click="closeMenu">Now Playing</NuxtLink>
      </div>

      <button class="w-full flex items-center justify-between py-3" @click="toggleSection('tv')" aria-controls="menu-tv" :aria-expanded="openSection === 'tv'">
        <span class="font-medium">TV Shows</span>
        <span class="text-xs opacity-70">{{ openSection === 'tv' ? '▲' : '▼' }}</span>
      </button>
      <div id="menu-tv" class="pl-4 space-y-2 transition-all duration-300" v-show="openSection === 'tv'">
        <NuxtLink to="/tv/popular" class="block py-2" @click="closeMenu">Popular TV Shows</NuxtLink>
        <NuxtLink to="/tv/top-rated" class="block py-2" @click="closeMenu">Top Rated TV Shows</NuxtLink>
        <NuxtLink to="/tv/on-air" class="block py-2" @click="closeMenu">TV Shows On Air</NuxtLink>
      </div>

      <button class="w-full flex items-center justify-between py-3" @click="toggleSection('people')" aria-controls="menu-people" :aria-expanded="openSection === 'people'">
        <span class="font-medium">People</span>
        <span class="text-xs opacity-70">{{ openSection === 'people' ? '▲' : '▼' }}</span>
      </button>
      <div id="menu-people" class="pl-4 space-y-2 transition-all duration-300" v-show="openSection === 'people'">
        <NuxtLink to="/people/popular-people" class="block py-2" @click="closeMenu">Popular People</NuxtLink>
      </div>
    </div>
  </div>
  <div class="fixed inset-0 bg-black/50 z-[250] lg:hidden" v-show="isOpen" @click="closeMenu"></div>
</template>
