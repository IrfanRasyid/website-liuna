// ============================================================
//  YouTube Data API v3 — Ryuta Amagiri Portfolio
//  Set in .env:
//    VITE_YOUTUBE_API_KEY     = your Data API v3 key
//    VITE_YOUTUBE_CHANNEL_ID  = UCxxxxxxxxxxxxxxxxxxxxxx
// ============================================================

const API_KEY    = import.meta.env.VITE_YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID

const BASE = 'https://www.googleapis.com/youtube/v3'

/** True when the API key + channel ID are properly configured */
export const isYouTubeConfigured =
  !!API_KEY &&
  API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE' &&
  !!CHANNEL_ID &&
  CHANNEL_ID !== 'UCxxxxxxxxxxxxxxxxxxxxxx'

// ─── helpers ────────────────────────────────────────────────

async function yt(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}`)
  url.searchParams.set('key', API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`YouTube API ${endpoint} → ${res.status}`)
  return res.json()
}

// ─── Channel stats ───────────────────────────────────────────

/**
 * Returns { subscriberCount, viewCount, videoCount } or null
 */
export async function getChannelStats() {
  if (!isYouTubeConfigured) return null
  try {
    const data = await yt('channels', {
      part: 'statistics,snippet',
      id: CHANNEL_ID,
    })
    return data.items?.[0]?.statistics ?? null
  } catch (err) {
    console.error('[YT] getChannelStats:', err)
    return null
  }
}

// ─── Latest uploaded videos ──────────────────────────────────

/**
 * Returns up to `maxResults` recent video upload search items.
 * Each item: { id: { videoId }, snippet: { title, publishedAt, thumbnails } }
 */
export async function getLatestVideos(maxResults = 8) {
  if (!isYouTubeConfigured) return []
  try {
    const data = await yt('search', {
      part: 'snippet',
      channelId: CHANNEL_ID,
      maxResults,
      order: 'date',
      type: 'video',
    })
    return data.items ?? []
  } catch (err) {
    console.error('[YT] getLatestVideos:', err)
    return []
  }
}

// ─── Recent completed streams ────────────────────────────────

/**
 * Returns completed livestream VODs (past streams).
 */
export async function getRecentStreams(maxResults = 6) {
  if (!isYouTubeConfigured) return []
  try {
    const data = await yt('search', {
      part: 'snippet',
      channelId: CHANNEL_ID,
      maxResults,
      order: 'date',
      type: 'video',
      eventType: 'completed',
    })
    return data.items ?? []
  } catch (err) {
    console.error('[YT] getRecentStreams:', err)
    return []
  }
}

// ─── Live stream (if currently live) ────────────────────────

/**
 * Returns the active livestream item or null if not live.
 */
export async function getLiveStream() {
  if (!isYouTubeConfigured) return null
  try {
    const data = await yt('search', {
      part: 'snippet',
      channelId: CHANNEL_ID,
      maxResults: 1,
      type: 'video',
      eventType: 'live',
    })
    return data.items?.[0] ?? null
  } catch (err) {
    console.error('[YT] getLiveStream:', err)
    return null
  }
}

// ─── Upcoming / scheduled streams ───────────────────────────

/**
 * Returns scheduled (not-yet-started) livestream items.
 * Each item includes snippet.liveBroadcastContent = 'upcoming'
 * and snippet.publishedAt (scheduled start time for upcoming broadcasts
 * is NOT exposed by the Search API — use actualStartTime from videos endpoint).
 */
export async function getUpcomingStreams(maxResults = 8) {
  if (!isYouTubeConfigured) return []
  try {
    // Step 1 — find upcoming broadcasts via Search
    const searchData = await yt('search', {
      part: 'snippet',
      channelId: CHANNEL_ID,
      maxResults,
      type: 'video',
      eventType: 'upcoming',
      order: 'date',
    })
    const items = searchData.items ?? []
    if (items.length === 0) return []

    // Step 2 — enrich with liveStreamingDetails to get scheduledStartTime
    const ids = items.map(i => i.id?.videoId).filter(Boolean).join(',')
    const videoData = await yt('videos', {
      part: 'snippet,liveStreamingDetails',
      id: ids,
    })

    const details = {}
    ;(videoData.items ?? []).forEach(v => {
      details[v.id] = v
    })

    // Merge scheduledStartTime into each search result
    return items.map(item => {
      const vid = details[item.id?.videoId]
      return {
        ...item,
        scheduledStartTime:
          vid?.liveStreamingDetails?.scheduledStartTime ?? null,
        // 'upcoming' | 'live' | 'none'
        liveBroadcastContent: vid?.snippet?.liveBroadcastContent ?? 'upcoming',
      }
    })
  } catch (err) {
    console.error('[YT] getUpcomingStreams:', err)
    return []
  }
}

// ─── Utility ─────────────────────────────────────────────────

export function formatSubscriberCount(count) {
  const n = parseInt(count)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

/** Build a YouTube watch URL from a videoId string or id object */
export function watchUrl(id) {
  const vid = typeof id === 'string' ? id : id?.videoId
  return `https://www.youtube.com/watch?v=${vid}`
}
