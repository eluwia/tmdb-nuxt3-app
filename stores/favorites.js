const KEY = 'fav.v1'

export const userFavorites = defineStore('favorites', {
  state: () => ({
    items: [],
    ready: false
  }),
  
  getters: {
    isFav: (state) => (media_type, id) =>
      state.items.some(item => item.media_type === media_type && item.id === id),
    ids: (state) => new Set(state.items.map(item => `${item.media_type}:${item.id}`))
  },
  
  actions: {
    init() {
      if (this.ready) return
      if (process.client) {
        try {
          const raw = localStorage.getItem(KEY)
          this.items = raw ? JSON.parse(raw) : []
        } catch (e) {
          console.warn('Favorites: read failed.', e)
          this.items = []
        }
      } else {
        this.items = []
      }
      this.ready = true
    },
    
    persist() {
      if (process.client) {
        try {
          localStorage.setItem(KEY, JSON.stringify(this.items))
        } catch (e) {
          console.warn('Favorites: write failed:', e)
        }
      }
    },
    
    toggle(item) {
      this.init()
      
      const key = `${item.media_type}:${item.id}`
      const idx = this.items.findIndex(item => `${item.media_type}:${item.id}` === key)
      
      if (idx >= 0) {
        this.items.splice(idx, 1)
      } else {
        this.items.push({
          id: item.id,
          media_type: item.media_type,
          title: item.title || item.name || '',
          poster_path: item.poster_path ?? item.backdrop_path ?? ''
        })
      }
      this.persist()
    },
    
    remove(media_type, id) {
      this.init()
      const before = this.items.length
      this.items = this.items.filter(item => !(item.media_type === media_type && item.id === id))
      if (this.items.length !== before) this.persist()
    },
    
    clear() {
      this.items = []
      this.persist()
    }
  }
})

export const useFavoritesStore = userFavorites
