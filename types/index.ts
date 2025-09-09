export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_name: string
  popularity: number
  origin_country: string[]
}

export interface Person {
  id: number
  name: string
  profile_path: string | null
  adult: boolean
  popularity: number
  known_for_department: string
  gender: number
  known_for: (Movie | TVShow)[]
}

export interface Genre {
  id: number
  name: string
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface MovieDetail extends Movie {
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  genres: Genre[]
  credits: Credits
  recommendations: {
    results: Movie[]
  }
  similar: {
    results: Movie[]
  }
}

export interface TVDetail extends TVShow {
  number_of_seasons: number
  number_of_episodes: number
  episode_run_time: number[]
  status: string
  tagline: string
  genres: Genre[]
  created_by: Person[]
  credits: Credits
  recommendations: {
    results: TVShow[]
  }
  similar: {
    results: TVShow[]
  }
}

export interface PersonDetail extends Person {
  biography: string
  birthday: string
  deathday: string | null
  place_of_birth: string
  known_for_department: string
  combined_credits: {
    cast: (Movie | TVShow)[]
    crew: (Movie | TVShow)[]
  }
}

export interface ApiResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface FavoriteItem {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title: string
  poster_path: string
}

export interface DetailsStoreItem {
  entity: MovieDetail | TVDetail | PersonDetail | null
  loading: boolean
  error: string | null
  fetchedAt: number
}

export interface MovieCardProps {
  item: Movie | TVShow | Person
  isFav: (item: Movie | TVShow | Person) => boolean
  toggleFav: (item: Movie | TVShow | Person) => void
}

export interface PageContentProps {
  title: string
  fetchFn: (page: number, options?: { signal?: AbortSignal }) => Promise<ApiResponse<any>>
  mediaType: 'movie' | 'tv' | 'person'
  resetKey?: number
  sanitizeFn?: (items: any[], mediaType: string) => any[]
}
