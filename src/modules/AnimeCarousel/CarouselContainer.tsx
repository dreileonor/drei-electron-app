import React, { useRef, useCallback } from 'react'
import type { AnimeData } from '../../types/anime'
import FloatingCard from './FloatingCard'

interface Props {
  animeList: AnimeData[]
  onCardClick: (anime: AnimeData) => void
  height: number
}

export default function CarouselContainer({ animeList, onCardClick, height }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return
    drag.current = {
      active: true,
      startX: e.pageX - trackRef.current.offsetLeft,
      scrollLeft: trackRef.current.scrollLeft,
      moved: false,
    }
    trackRef.current.style.cursor = 'grabbing'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current.active || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    const delta = x - drag.current.startX
    if (Math.abs(delta) > 4) drag.current.moved = true
    trackRef.current.scrollLeft = drag.current.scrollLeft - delta
  }, [])

  const onMouseUp = useCallback(() => {
    drag.current.active = false
    if (trackRef.current) trackRef.current.style.cursor = 'grab'
  }, [])

  const onMouseLeave = useCallback(() => {
    drag.current.active = false
    if (trackRef.current) trackRef.current.style.cursor = 'grab'
  }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (!trackRef.current) return
    e.preventDefault()
    trackRef.current.scrollLeft += e.deltaY || e.deltaX
  }, [])

  const handleCardClick = useCallback(
    (anime: AnimeData) => {
      if (!drag.current.moved) onCardClick(anime)
    },
    [onCardClick]
  )

  return (
    <div
      ref={trackRef}
      className="carousel-track flex gap-3 px-3 py-2"
      style={{ height, cursor: 'grab', alignItems: 'center' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
    >
      {animeList.map((anime) => (
        <FloatingCard key={anime.mal_id} anime={anime} onClick={() => handleCardClick(anime)} />
      ))}
    </div>
  )
}
