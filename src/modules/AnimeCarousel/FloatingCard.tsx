import React, { useState } from 'react'
import { Star, Tv, ImageOff } from 'lucide-react'
import type { AnimeData } from '../../types/anime'

interface Props {
  anime: AnimeData
  onClick: () => void
}

export default function FloatingCard({ anime, onClick }: Props) {
  const largeUrl = anime.images?.jpg?.large_image_url
  const fallbackUrl = anime.images?.jpg?.image_url
  const [imgSrc, setImgSrc] = useState(largeUrl || fallbackUrl || '')
  const [imgError, setImgError] = useState(false)

  const handleImgError = () => {
    if (imgSrc === largeUrl && fallbackUrl && fallbackUrl !== largeUrl) {
      setImgSrc(fallbackUrl)
    } else {
      setImgError(true)
    }
  }

  const displayTitle = anime.title_english || anime.title

  return (
    <div
      className="relative flex-shrink-0 w-40 h-60 rounded-xl overflow-hidden cursor-pointer card-glow transition-transform duration-200 hover:scale-105 hover:-translate-y-1 select-none"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      onClick={onClick}
    >
      {/* Poster or CSS fallback */}
      {!imgError && imgSrc ? (
        <img
          src={imgSrc}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImgError}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0f0f1a]">
          <ImageOff size={24} className="text-purple-800" />
          <span className="text-gray-600 text-xs text-center px-2 leading-tight line-clamp-3">
            {displayTitle}
          </span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-2 space-y-0.5">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
          {displayTitle}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {anime.score && (
            <span className="flex items-center gap-0.5 text-yellow-400 text-xs">
              <Star size={10} fill="currentColor" />
              {anime.score.toFixed(1)}
            </span>
          )}
          {anime.episodes && (
            <span className="flex items-center gap-0.5 text-gray-400 text-xs">
              <Tv size={10} />
              {anime.episodes}ep
            </span>
          )}
        </div>
      </div>

      {/* Status dot */}
      {anime.status === 'Currently Airing' && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      )}
    </div>
  )
}
