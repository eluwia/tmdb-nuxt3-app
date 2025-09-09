import { defineStore } from 'pinia'
import { useTmdbClient } from '../composables/useTmdbClient'

const TTL = 15 * 60 * 1000 

export const useDetailsStore = defineStore('details', {
  state: () => ({
    items: {} 
  }),
  actions: {
    key(type, id){ return `${type}:${id}` },
    _set(key, payload){ this.items[key] = { ...(this.items[key]||{}), ...payload } },
    async fetchMovie(id){
      const key = this.key('movie', id)
      const existing = this.items[key]
      if (existing && existing.loading) return existing
      if (existing && Date.now() - (existing.fetchedAt || 0) < TTL) return existing
      this._set(key, { loading: true, error: null })
      try{
        const { tmdb } = useTmdbClient()
        const raw = await tmdb.movieDetail(id)
        if (!raw || !raw.id) {
          throw new Error('Invalid movie data received')
        }
        const entity = {
          type: 'movie',
          id: raw.id,
          title: raw.title,
          release_date: raw.release_date,
          runtime: raw.runtime,
          genres: raw.genres || [],
          vote_average: raw.vote_average,
          poster_path: raw.poster_path,
          backdrop_path: raw.backdrop_path,
          overview: raw.overview,
          credits: raw.credits || {}
        }
        this._set(key, { entity, fetchedAt: Date.now(), loading: false, error: null })
        return this.items[key]
      }catch(e){
        console.error('Movie fetch error:', e)
        this._set(key, { loading: false, error: e.message || String(e) })
        throw e
      }
    },
    async fetchTv(id){
      const key = this.key('tv', id)
      const existing = this.items[key]
      if (existing && existing.loading) return existing
      if (existing && Date.now() - (existing.fetchedAt || 0) < TTL) return existing
      this._set(key, { loading: true, error: null })
      try{
        const { tmdb } = useTmdbClient()
        const raw = await tmdb.tvDetail(id)
        if (!raw || !raw.id) {
          throw new Error('Invalid TV data received')
        }
        const entity = {
          type: 'tv',
          id: raw.id,
          name: raw.name,
          first_air_date: raw.first_air_date,
          episode_run_time: (raw.episode_run_time||[])[0] || null,
          genres: raw.genres || [],
          vote_average: raw.vote_average,
          poster_path: raw.poster_path,
          backdrop_path: raw.backdrop_path,
          overview: raw.overview,
          created_by: raw.created_by || [],
          credits: raw.credits || {}
        }
        this._set(key, { entity, fetchedAt: Date.now(), loading: false, error: null })
        return this.items[key]
      }catch(e){
        console.error('TV fetch error:', e)
        this._set(key, { loading: false, error: e.message || String(e) })
        throw e
      }
    },
    async fetchPerson(id){
      const key = this.key('person', id)
      const existing = this.items[key]
      if (existing && existing.loading) return existing
      if (existing && Date.now() - (existing.fetchedAt || 0) < TTL) return existing
      this._set(key, { loading: true, error: null })
      try{
        const { tmdb } = useTmdbClient()
        const raw = await tmdb.personDetail(id)
        if (!raw || !raw.id) {
          throw new Error('Invalid person data received')
        }
        const combined = raw.combined_credits || {}
        const known_for = (combined.cast||[]).concat(combined.crew||[])
          .sort((a,b)=> (b.popularity||0)-(a.popularity||0)).slice(0,10)
        const entity = {
          type: 'person',
          id: raw.id,
          name: raw.name,
          profile_path: raw.profile_path,
          biography: raw.biography,
          known_for_department: raw.known_for_department,
          place_of_birth: raw.place_of_birth,
          birthday: raw.birthday,
          deathday: raw.deathday,
          known_for: known_for
        }
        this._set(key, { entity, fetchedAt: Date.now(), loading: false, error: null })
        return this.items[key]
      }catch(e){
        console.error('Person fetch error:', e)
        this._set(key, { loading: false, error: e.message || String(e) })
        throw e
      }
    }
  }
})
