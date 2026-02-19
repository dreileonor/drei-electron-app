import React, { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Settings2, Eye, EyeOff, SlidersHorizontal, X, ChevronRight } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { setDragging } from '../../utils/dragState'

export default function GearHub() {
  const { isCarouselOpen, toggleCarousel, settings, updateSettings } = useAppStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const dragStarted = useRef(false)

  const handleDragStart = useCallback(() => {
    dragStarted.current = true
    setDragging(true)
    window.api.setMouseIgnore(false)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragging(false)
    setTimeout(() => {
      dragStarted.current = false
    }, 80)
    window.api.setMouseIgnore(true, { forward: true })
  }, [])

  const handleGearClick = useCallback(() => {
    if (dragStarted.current) return
    setIsMenuOpen((v) => !v)
    if (isSettingsOpen) setIsSettingsOpen(false)
  }, [isSettingsOpen])

  const handleToggleCarousel = useCallback(() => {
    toggleCarousel()
    setIsMenuOpen(false)
  }, [toggleCarousel])

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true)
    setIsMenuOpen(false)
  }, [])

  const handleClose = useCallback(() => {
    window.api.closeApp()
  }, [])

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ x: 20, y: 220 }}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
    >
      <div className="relative select-none">
        {/* Gear button */}
        <button
          onClick={handleGearClick}
          className={`w-13 h-13 rounded-full glass flex items-center justify-center transition-colors duration-200 hover:bg-purple-600/30 gear-pulse`}
          style={{ width: 52, height: 52 }}
          title="Drei Menu"
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Settings2 size={22} className="text-purple-300" />
          </motion.div>
        </button>

        {/* Popup menu */}
        {isMenuOpen && !isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-2 glass rounded-xl py-1.5 min-w-[180px] shadow-xl shadow-black/50"
          >
            <button
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white rounded-lg mx-1 transition-colors"
              style={{ width: 'calc(100% - 8px)' }}
              onClick={handleToggleCarousel}
            >
              {isCarouselOpen ? (
                <EyeOff size={15} className="text-purple-400" />
              ) : (
                <Eye size={15} className="text-purple-400" />
              )}
              {isCarouselOpen ? 'Hide Carousel' : 'Show Carousel'}
            </button>

            <button
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white rounded-lg mx-1 transition-colors"
              style={{ width: 'calc(100% - 8px)' }}
              onClick={handleOpenSettings}
            >
              <SlidersHorizontal size={15} className="text-purple-400" />
              <span className="flex-1">Settings</span>
              <ChevronRight size={13} className="text-gray-500" />
            </button>

            <div className="my-1 border-t border-white/10" />

            <button
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg mx-1 transition-colors"
              style={{ width: 'calc(100% - 8px)' }}
              onClick={handleClose}
            >
              <X size={15} />
              Quit App
            </button>
          </motion.div>
        )}

        {/* Settings panel */}
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-2 glass rounded-xl p-3 w-60 shadow-xl shadow-black/50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Carousel Size</span>
              <button
                onClick={() => { setIsSettingsOpen(false); setIsMenuOpen(true) }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Width slider */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Width</span>
                <span className="text-purple-400">{settings.carouselWidth}px</span>
              </div>
              <input
                type="range"
                min={500}
                max={1400}
                step={10}
                value={settings.carouselWidth}
                onChange={(e) => updateSettings({ carouselWidth: Number(e.target.value) })}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#9333ea' }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                <span>500</span>
                <span>1400</span>
              </div>
            </div>

            {/* Height slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Height</span>
                <span className="text-purple-400">{settings.carouselHeight}px</span>
              </div>
              <input
                type="range"
                min={280}
                max={600}
                step={10}
                value={settings.carouselHeight}
                onChange={(e) => updateSettings({ carouselHeight: Number(e.target.value) })}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#9333ea' }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                <span>280</span>
                <span>600</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
