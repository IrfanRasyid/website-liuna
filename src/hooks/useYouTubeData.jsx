import { createContext, useContext, useState, useEffect } from 'react'
import {
  isYouTubeConfigured,
  getChannelStats,
  getLatestVideos,
  getRecentStreams,
  getLiveStream,
} from '../lib/youtube'

// ─── Mock data (used when API key is not set or 403 occurs) ──

const MOCK_STATS = { subscriberCount: '12500', viewCount: '450000', videoCount: '180' }

const MOCK_VIDEOS = [
  { id: { videoId: 'mock1' }, snippet: { title: '【Minecraft】 Building Snow Mountain Base | Ryuta Amagiri', publishedAt: '2024-12-01T14:00:00Z', thumbnails: { high: { url: 'https://picsum.photos/seed/v1/480/270' } } } },
  { id: { videoId: 'mock2' }, snippet: { title: '【Apex Legends】 Late Night Ranked Climb 🏔️', publishedAt: '2024-11-28T15:30:00Z', thumbnails: { high: { url: 'https://picsum.photos/seed/v2/480/270' } } } },
  { id: { videoId: 'mock3' }, snippet: { title: '【Genshin Impact】 Exploring new areas with the onidragon ❄️', publishedAt: '2024-11-25T13:00:00Z', thumbnails: { high: { url: 'https://picsum.photos/seed/v3/480/270' } } } },
  { id: { videoId: 'mock4' }, snippet: { title: '【Zatsu Talk】 Chatting with Onigiris about winter ☃️', publishedAt: '2024-11-22T16:00:00Z', thumbnails: { high: { url: 'https://picsum.photos/seed/v4/480/270' } } } },
  { id: { videoId: 'mock5' }, snippet: { title: '【Karaoke】 Snow & Ice Song Covers 🎵', publishedAt: '2024-11-18T17:00:00Z', thumbnails: { high: { url: 'https://picsum.photos/seed/v5/480/270' } } } },
  { id: { videoId: 'mock6' }, snippet: { title: '【Valorant】 We going Immortal this season 🔥', publishedAt: '2024-11-15T14:00:00Z', thumbnails: { high: { url: 'https://picsum.photos/seed/v6/480/270' } } } },
]

// ─── Context ─────────────────────────────────────────────────

const YouTubeContext = createContext(null)

export function YouTubeProvider({ children }) {
  const [stats,      setStats]      = useState(null)
  const [videos,     setVideos]     = useState([])
  const [streams,    setStreams]     = useState([])
  const [liveStream, setLiveStream] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [isMock,     setIsMock]     = useState(false)

  useEffect(() => {
    if (!isYouTubeConfigured) {
      const t = setTimeout(() => {
        setStats(MOCK_STATS)
        setVideos(MOCK_VIDEOS)
        setStreams(MOCK_VIDEOS.slice(0, 4))
        setLiveStream(null)
        setIsMock(true)
        setLoading(false)
      }, 700)
      return () => clearTimeout(t)
    }

    let cancelled = false

    const fetchAll = async () => {
      setLoading(true)
      try {
        const [channelStats, videosData, streamsData, liveData] = await Promise.all([
          getChannelStats(),
          getLatestVideos(8),
          getRecentStreams(6),
          getLiveStream(),
        ])
        if (cancelled) return
        setStats(channelStats ?? MOCK_STATS)
        setVideos(videosData.length  > 0 ? videosData  : MOCK_VIDEOS)
        setStreams(streamsData.length > 0 ? streamsData : MOCK_VIDEOS.slice(0, 4))
        setLiveStream(liveData ?? null)
      } catch (err) {
        if (cancelled) return
        console.error('[YouTubeProvider]', err)
        setStats(MOCK_STATS)
        setVideos(MOCK_VIDEOS)
        setStreams(MOCK_VIDEOS.slice(0, 4))
        setLiveStream(null)
        setIsMock(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  const value = { stats, videos, streams, liveStream, loading, isMock }

  return (
    <YouTubeContext.Provider value={value}>
      {children}
    </YouTubeContext.Provider>
  )
}

/** Hook — must be used inside <YouTubeProvider> */
export function useYouTubeData() {
  const ctx = useContext(YouTubeContext)
  if (!ctx) throw new Error('useYouTubeData must be used inside <YouTubeProvider>')
  return ctx
}
