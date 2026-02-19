import React, { useEffect } from 'react'
import GearHub from './components/ModuleHub/GearHub'
import AnimeCarousel from './modules/AnimeCarousel'
import { isDragging } from './utils/dragState'

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging()) return
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === document.documentElement || el === document.body || el.id === 'root') {
        window.api.setMouseIgnore(true, { forward: true })
      } else {
        window.api.setMouseIgnore(false)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div style={{ pointerEvents: 'auto', display: 'contents' }}>
        <GearHub />
        <AnimeCarousel />
      </div>
    </div>
  )
}
