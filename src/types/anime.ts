export interface StreamingService {
  name: string
  url: string
}

export interface AnimeGenre {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface AnimeImages {
  jpg: {
    image_url: string
    large_image_url?: string
  }
  webp?: {
    image_url: string
    large_image_url?: string
  }
}

export interface AnimeData {
  mal_id: number
  title: string
  title_english?: string
  images: AnimeImages
  score?: number
  episodes?: number
  synopsis?: string
  genres?: AnimeGenre[]
  streaming?: StreamingService[]
  status?: string
  year?: number
  season?: string
}

export interface EpisodeData {
  mal_id: number
  title: string
  title_romanji?: string
  aired?: string
  filler: boolean
  recap: boolean
}

export interface EpisodePagination {
  last_visible_page: number
  has_next_page: boolean
  current_page: number
  items: {
    count: number
    total: number
    per_page: number
  }
}
