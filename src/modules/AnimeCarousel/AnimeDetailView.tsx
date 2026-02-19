import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Star, Tv, ExternalLink, Play, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { AnimeData, EpisodeData, EpisodePagination } from '../../types/anime'
import { fetchAnimeEpisodes, fetchAnimeDetails } from './api'

interface Props {
  anime: AnimeData
  onBack: () => void
  height: number
}

export default function AnimeDetailView({ anime: initialAnime, onBack, height }: Props) {
  const [anime, setAnime] = useState<AnimeData>(initialAnime)
  const [episodes, setEpisodes] = useState<EpisodeData[]>([])
  const [pagination, setPagination] = useState<EpisodePagination | null>(null)
  const [page, setPage] = useState(1)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [watchingEp, setWatchingEp] = useState<number | null>(null)

  // Fetch full anime details (includes streaming links)
  useEffect(() => {
    fetchAnimeDetails(anime.mal_id)
      .then((full) => setAnime(full))
      .catch(() => {/* keep initial data */})
  }, [anime.mal_id])

  // Fetch episodes when page changes
  useEffect(() => {
    setLoadingEpisodes(true)
    fetchAnimeEpisodes(anime.mal_id, page)
      .then(({ episodes: eps, pagination: pag }) => {
        setEpisodes(eps)
        setPagination(pag)
      })
      .catch(() => {
        setEpisodes([])
        setPagination(null)
      })
      .finally(() => setLoadingEpisodes(false))
  }, [anime.mal_id, page])

  const handleWatch = useCallback(
    async (ep: EpisodeData) => {
      setWatchingEp(ep.mal_id)
      try {
        const title = anime.title_english || anime.title
        const url = await window.api.scrapeStream(title)
        if (url) {
          window.api.openPlayer(url)
        } else {
          // Fallback: Google search
          const query = encodeURIComponent(`watch ${title} episode ${ep.mal_id} online`)
          window.api.openExternal(`https://www.google.com/search?q=${query}`)
        }
      } catch {
        const query = encodeURIComponent(`watch ${anime.title} episode ${ep.mal_id}`)
        window.api.openExternal(`https://www.google.com/search?q=${query}`)
      } finally {
        setWatchingEp(null)
      }
    },
    [anime]
  )

  const displayTitle = anime.title_english || anime.title
  const posterUrl =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    'https://via.placeholder.com/200x280/1a1a2e/9333ea?text=No+Image'

  const totalPages = pagination?.last_visible_page ?? 1

  return (
    <div className="flex flex-col" style={{ height }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <span className="text-gray-600">·</span>
        <span className="text-sm text-white font-medium truncate">{displayTitle}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* Anime Info Card */}
        <div className="flex gap-3">
          <img
            src={posterUrl}
            alt={displayTitle}
            className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-sm leading-tight mb-1">{displayTitle}</h2>
            {anime.title !== displayTitle && (
              <p className="text-gray-500 text-xs mb-1">{anime.title}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-2">
              {anime.score && (
                <span className="flex items-center gap-1 text-yellow-400 text-xs">
                  <Star size={11} fill="currentColor" />
                  {anime.score.toFixed(2)}
                </span>
              )}
              {anime.episodes && (
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Tv size={11} />
                  {anime.episodes} eps
                </span>
              )}
              {anime.status && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    anime.status === 'Currently Airing'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {anime.status}
                </span>
              )}
            </div>
            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {anime.genres.slice(0, 4).map((g) => (
                  <span
                    key={g.mal_id}
                    className="text-xs px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/20"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        {anime.synopsis && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{anime.synopsis}</p>
        )}

        {/* Streaming links */}
        {anime.streaming && anime.streaming.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Stream On</p>
            <div className="flex flex-wrap gap-1.5">
              {anime.streaming.map((s, i) => (
                <button
                  key={i}
                  onClick={() => window.api.openExternal(s.url)}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                >
                  <ExternalLink size={10} />
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episode List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Episodes</p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-0.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-gray-400">
                  {page}/{totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-0.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {loadingEpisodes ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={20} className="text-purple-400 animate-spin" />
            </div>
          ) : episodes.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-4">No episode data available</p>
          ) : (
            <div className="space-y-0.5">
              {episodes.map((ep) => (
                <div
                  key={ep.mal_id}
                  className="episode-item flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-gray-500 text-xs w-8 flex-shrink-0 font-mono">
                    {ep.mal_id}
                  </span>
                  <span className="text-gray-300 text-xs flex-1 truncate">
                    {ep.title || `Episode ${ep.mal_id}`}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {ep.filler && (
                      <span className="badge-filler text-xs px-1 py-0.5 rounded text-[10px]">
                        F
                      </span>
                    )}
                    {ep.recap && (
                      <span className="badge-recap text-xs px-1 py-0.5 rounded text-[10px]">
                        R
                      </span>
                    )}
                    <button
                      onClick={() => handleWatch(ep)}
                      disabled={watchingEp === ep.mal_id}
                      className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded bg-purple-600/80 hover:bg-purple-500 text-white transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      {watchingEp === ep.mal_id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Play size={10} fill="currentColor" />
                      )}
                      Watch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
