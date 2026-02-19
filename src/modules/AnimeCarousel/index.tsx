import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { Loader2, RefreshCw, X, GripHorizontal, SlidersHorizontal } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { fetchCurrentSeasonAnime, SAMPLE_ANIME } from './api'
import CarouselContainer from './CarouselContainer'
import AnimeDetailView from './AnimeDetailView'
import type { AnimeData } from '../../types/anime'
import { setDragging } from '../../utils/dragState'

export default function AnimeCarousel() {
  const { isCarouselOpen, setCarouselOpen, animeData, setAnimeData, settings, updateSettings } =
    useAppStore()

  const [loading, setLoading] = useState(false)
  const [usingSample, setUsingSample] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState<AnimeData | null>(null)
  const [showSizeSettings, setShowSizeSettings] = useState(false)
  const dragControls = useDragControls()

  // Fetch anime data
  const loadAnime = useCallback(async () => {
    setLoading(true)
    setUsingSample(false)
    try {
      const data = await fetchCurrentSeasonAnime()
      if (data && data.length > 0) {
        setAnimeData(data)
      } else {
        setAnimeData(SAMPLE_ANIME)
        setUsingSample(true)
      }
    } catch {
      setAnimeData(SAMPLE_ANIME)
      setUsingSample(true)
    } finally {
      setLoading(false)
    }
  }, [setAnimeData])

  useEffect(() => {
    if (isCarouselOpen && animeData.length === 0) {
      loadAnime()
    }
  }, [isCarouselOpen, animeData.length, loadAnime])

  if (!isCarouselOpen) return null

  const HEADER_H = 40
  const totalHeight = HEADER_H + settings.carouselHeight

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setDragging(true)
        window.api.setMouseIgnore(false)
      }}
      onDragEnd={() => {
        setDragging(false)
        window.api.setMouseIgnore(true, { forward: true })
      }}
      initial={{ x: 60, y: 100 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9998,
        width: settings.carouselWidth,
        height: totalHeight,
      }}
    >
      <div
        className="glass rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black/60"
        style={{ width: settings.carouselWidth, height: totalHeight }}
      >
        {/* Header (drag handle) */}
        <div
          className="flex items-center justify-between px-3 flex-shrink-0 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
          style={{ height: HEADER_H }}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal size={14} className="text-gray-600" />
            <span className="text-white text-sm font-semibold">Currently Airing</span>
            {usingSample && (
              <span className="text-xs text-yellow-500/80 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                Sample
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Refresh */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={loadAnime}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>

            {/* Size settings */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setShowSizeSettings((v) => !v)}
              className={`p-1 rounded-md hover:bg-white/10 transition-colors ${showSizeSettings ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
              title="Resize"
            >
              <SlidersHorizontal size={13} />
            </button>

            {/* Close */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setCarouselOpen(false)}
              className="p-1 text-gray-400 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-colors"
              title="Close"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Size settings bar */}
        {showSizeSettings && (
          <div className="flex items-center gap-4 px-3 py-2 border-b border-white/10 bg-black/20 flex-shrink-0">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-gray-500 w-10">W</span>
              <input
                type="range"
                min={500}
                max={1400}
                step={10}
                value={settings.carouselWidth}
                onChange={(e) => updateSettings({ carouselWidth: Number(e.target.value) })}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#9333ea' }}
              />
              <span className="text-xs text-purple-400 w-14 text-right">
                {settings.carouselWidth}px
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-gray-500 w-10">H</span>
              <input
                type="range"
                min={280}
                max={600}
                step={10}
                value={settings.carouselHeight}
                onChange={(e) => updateSettings({ carouselHeight: Number(e.target.value) })}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#9333ea' }}
              />
              <span className="text-xs text-purple-400 w-14 text-right">
                {settings.carouselHeight}px
              </span>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-purple-400 animate-spin" />
                <span className="text-gray-400 text-sm">Fetching current season…</span>
              </div>
            </div>
          ) : selectedAnime ? (
            <AnimeDetailView
              anime={selectedAnime}
              onBack={() => setSelectedAnime(null)}
              height={settings.carouselHeight - (showSizeSettings ? 36 : 0)}
            />
          ) : (
            <CarouselContainer
              animeList={animeData.length > 0 ? animeData : SAMPLE_ANIME}
              onCardClick={setSelectedAnime}
              height={settings.carouselHeight - (showSizeSettings ? 36 : 0)}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
