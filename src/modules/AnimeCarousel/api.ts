import axios from 'axios'
import type { AnimeData, EpisodeData, EpisodePagination } from '../../types/anime'

const JIKAN = 'https://api.jikan.moe/v4'

// --- Seasonal anime ---
export async function fetchCurrentSeasonAnime(): Promise<AnimeData[]> {
  const { data } = await axios.get(`${JIKAN}/seasons/now`, {
    params: { limit: 25, sfw: true },
    timeout: 12000,
  })
  return data.data as AnimeData[]
}

// --- Episode list (paginated) ---
export async function fetchAnimeEpisodes(
  malId: number,
  page = 1
): Promise<{ episodes: EpisodeData[]; pagination: EpisodePagination }> {
  const { data } = await axios.get(`${JIKAN}/anime/${malId}/episodes`, {
    params: { page },
    timeout: 12000,
  })
  return { episodes: data.data as EpisodeData[], pagination: data.pagination as EpisodePagination }
}

// --- Full anime details (includes streaming links) ---
export async function fetchAnimeDetails(malId: number): Promise<AnimeData> {
  const { data } = await axios.get(`${JIKAN}/anime/${malId}`, { timeout: 10000 })
  return data.data as AnimeData
}

// --- Sample fallback data ---
export const SAMPLE_ANIME: AnimeData[] = [
  {
    mal_id: 52991,
    title: 'Sousou no Frieren',
    title_english: 'Frieren: Beyond Journey\'s End',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg' } },
    score: 9.38,
    episodes: 28,
    synopsis: 'The adventure is over but life goes on for an elf mage just beginning to learn what living is all about.',
    genres: [{ mal_id: 2, type: 'anime', name: 'Adventure', url: '' }, { mal_id: 10, type: 'anime', name: 'Fantasy', url: '' }],
    streaming: [{ name: 'Crunchyroll', url: 'https://www.crunchyroll.com/frieren-beyond-journeys-end' }],
    status: 'Finished Airing',
  },
  {
    mal_id: 54492,
    title: 'Dungeon Meshi',
    title_english: 'Delicious in Dungeon',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1935/138717.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1935/138717l.jpg' } },
    score: 8.72,
    episodes: 24,
    synopsis: 'A team of adventurers ventures into a dungeon and begins cooking monsters to survive.',
    genres: [{ mal_id: 2, type: 'anime', name: 'Adventure', url: '' }, { mal_id: 8, type: 'anime', name: 'Comedy', url: '' }],
    streaming: [{ name: 'Netflix', url: 'https://www.netflix.com/title/81564899' }],
    status: 'Finished Airing',
  },
  {
    mal_id: 55701,
    title: 'Kimetsu no Yaiba: Hashira Geiko-hen',
    title_english: 'Demon Slayer: Hashira Training Arc',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1765/141042.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1765/141042l.jpg' } },
    score: 8.55,
    episodes: 8,
    synopsis: 'Tanjiro and the Demon Slayer Corps train under the Hashira to prepare for the final battle.',
    genres: [{ mal_id: 1, type: 'anime', name: 'Action', url: '' }, { mal_id: 10, type: 'anime', name: 'Fantasy', url: '' }],
    streaming: [{ name: 'Crunchyroll', url: 'https://www.crunchyroll.com' }],
    status: 'Finished Airing',
  },
  {
    mal_id: 57334,
    title: 'Oshi no Ko 2nd Season',
    title_english: 'Oshi no Ko Season 2',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1462/145794.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1462/145794l.jpg' } },
    score: 8.1,
    episodes: 13,
    synopsis: 'Aqua and Ruby\'s story continues as they dive deeper into the entertainment world.',
    genres: [{ mal_id: 8, type: 'anime', name: 'Comedy', url: '' }, { mal_id: 22, type: 'anime', name: 'Romance', url: '' }],
    streaming: [{ name: 'HIDIVE', url: 'https://www.hidive.com' }],
    status: 'Finished Airing',
  },
  {
    mal_id: 51009,
    title: 'Haikyuu!! Movie: Gomisuteba no Kessen',
    title_english: 'Haikyu!! The Dumpster Battle',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1459/140313.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1459/140313l.jpg' } },
    score: 8.62,
    episodes: 1,
    synopsis: 'Hinata and Kageyama face the formidable Nekoma team in the Battle at the Garbage Dump.',
    genres: [{ mal_id: 30, type: 'anime', name: 'Sports', url: '' }, { mal_id: 27, type: 'anime', name: 'Shounen', url: '' }],
    streaming: [],
    status: 'Finished Airing',
  },
  {
    mal_id: 53887,
    title: 'Kaijuu 8-gou',
    title_english: 'Kaiju No. 8',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1897/138588.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1897/138588l.jpg' } },
    score: 7.91,
    episodes: 12,
    synopsis: 'A man fighting kaiju suddenly becomes one himself and must hide his secret while protecting humanity.',
    genres: [{ mal_id: 1, type: 'anime', name: 'Action', url: '' }, { mal_id: 24, type: 'anime', name: 'Sci-Fi', url: '' }],
    streaming: [{ name: 'Crunchyroll', url: 'https://www.crunchyroll.com/kaiju-no-8' }],
    status: 'Currently Airing',
  },
  {
    mal_id: 58514,
    title: 'Boku no Hero Academia 7th Season',
    title_english: 'My Hero Academia Season 7',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1507/143762.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1507/143762l.jpg' } },
    score: 8.12,
    episodes: 21,
    synopsis: 'The heroes face their greatest challenge yet as All For One makes his final move.',
    genres: [{ mal_id: 1, type: 'anime', name: 'Action', url: '' }, { mal_id: 27, type: 'anime', name: 'Shounen', url: '' }],
    streaming: [{ name: 'Crunchyroll', url: 'https://www.crunchyroll.com/my-hero-academia' }],
    status: 'Finished Airing',
  },
  {
    mal_id: 56839,
    title: 'Mushoku Tensei II: Isekai Ittara Honki Dasu Part 3',
    title_english: 'Mushoku Tensei: Jobless Reincarnation Season 2 Part 3',
    images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/anime/1520/144804.jpg', large_image_url: 'https://cdn.myanimelist.net/images/anime/1520/144804l.jpg' } },
    score: 8.49,
    episodes: 12,
    synopsis: 'Rudeus continues his journey of self-discovery and redemption in his second life.',
    genres: [{ mal_id: 2, type: 'anime', name: 'Adventure', url: '' }, { mal_id: 10, type: 'anime', name: 'Fantasy', url: '' }],
    streaming: [{ name: 'Crunchyroll', url: 'https://www.crunchyroll.com/mushoku-tensei-jobless-reincarnation' }],
    status: 'Currently Airing',
  },
]
