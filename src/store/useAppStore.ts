import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AnimeData } from '../types/anime'

interface AppSettings {
  carouselWidth: number
  carouselHeight: number
  theme: string
  autoRefresh: boolean
  refreshInterval: number
}

interface AppState {
  isCarouselOpen: boolean
  animeData: AnimeData[]
  settings: AppSettings
  // Actions
  setCarouselOpen: (open: boolean) => void
  toggleCarousel: () => void
  setAnimeData: (data: AnimeData[]) => void
  updateSettings: (partial: Partial<AppSettings>) => void
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isCarouselOpen: false,
      animeData: [],
      settings: {
        carouselWidth: 900,
        carouselHeight: 380,
        theme: 'dark',
        autoRefresh: false,
        refreshInterval: 30,
      },

      setCarouselOpen: (open) => set({ isCarouselOpen: open }),
      toggleCarousel: () => set((s) => ({ isCarouselOpen: !s.isCarouselOpen })),
      setAnimeData: (data) => set({ animeData: data }),
      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),
    }),
    {
      name: 'drei-app-storage',
      partialize: (state) => ({
        settings: state.settings,
        isCarouselOpen: state.isCarouselOpen,
      }),
    }
  )
)

export default useAppStore
