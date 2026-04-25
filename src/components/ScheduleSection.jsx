import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiExternalLink, FiRadio } from 'react-icons/fi'
import { SiYoutube } from 'react-icons/si'
import { useYouTubeData } from '../hooks/useYouTubeData'
import { watchUrl } from '../lib/youtube'
import './ScheduleSection.css'

// ─── Helpers ─────────────────────────────────────────────────

function formatScheduledTime(isoString) {
  if (!isoString) return null
  const d = new Date(isoString)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return {
    day:   dayNames[d.getDay()],
    date:  d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    time:  d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }),
    iso:   isoString,
  }
}

function isToday(isoString) {
  if (!isoString) return false
  const d   = new Date(isoString)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

function timeUntil(isoString) {
  if (!isoString) return ''
  const diff = new Date(isoString) - Date.now()
  if (diff <= 0) return 'Starting soon...'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 48) return `In ${Math.floor(h / 24)} days`
  if (h > 0)  return `In ${h}h ${m}m`
  return `In ${m}m`
}

// ─── Single schedule card ─────────────────────────────────────

function ScheduleCard({ item, index }) {
  const isLive      = item.liveBroadcastContent === 'live'
  const timeStr     = formatScheduledTime(item.scheduledStartTime)
  const today       = isToday(item.scheduledStartTime)
  const countdown   = timeUntil(item.scheduledStartTime)
  const title       = item.snippet?.title ?? 'Upcoming Stream'
  const thumb       = item.snippet?.thumbnails?.medium?.url
                      ?? item.snippet?.thumbnails?.high?.url
  const url         = watchUrl(item.id)

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`schedule__item glass-card ${today || isLive ? 'schedule__item--today' : ''} ${isLive ? 'schedule__item--live' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ x: 4 }}
      style={{ textDecoration: 'none' }}
      id={`schedule-item-${index}`}
    >
      {/* Thumbnail */}
      {thumb && (
        <div className="schedule__thumb">
          <img src={thumb} alt={title} loading="lazy" />
          {isLive && (
            <div className="schedule__live-badge">
              <FiRadio size={9} />
              LIVE
            </div>
          )}
        </div>
      )}

      {/* Date block (only when scheduled time is known) */}
      {timeStr ? (
        <div className="schedule__date">
          <span className="schedule__day">{timeStr.day}</span>
          <span className="schedule__num">{timeStr.date}</span>
          <span className="schedule__month">{timeStr.month}</span>
        </div>
      ) : (
        <div className="schedule__date schedule__date--tbd">
          <span className="schedule__day">TBD</span>
          <span className="schedule__num">?</span>
        </div>
      )}

      {/* Divider */}
      <div className="schedule__divider" />

      {/* Info */}
      <div className="schedule__info">
        <div className="schedule__title">{title}</div>
        <div className="schedule__meta">
          {isLive ? (
            <span className="schedule__game schedule__game--live">
              <FiRadio size={10} />
              Streaming now
            </span>
          ) : timeStr ? (
            <span className="schedule__time">
              <FiClock size={11} />
              {timeStr.time} WIB
            </span>
          ) : null}
          {!isLive && countdown && (
            <span className="schedule__countdown">{countdown}</span>
          )}
        </div>
      </div>

      {/* Status / Link */}
      <div className="schedule__status">
        {isLive ? (
          <span className="badge badge-live">LIVE</span>
        ) : today ? (
          <span className="badge badge-live">Today</span>
        ) : (
          <FiExternalLink size={14} className="schedule__ext-icon" />
        )}
      </div>
    </motion.a>
  )
}

// ─── Section ──────────────────────────────────────────────────

export default function ScheduleSection() {
  const { upcoming, liveStream, loading, isMock } = useYouTubeData()

  // Merge live stream at top if one is active
  const items = [
    ...(liveStream ? [{ ...liveStream, liveBroadcastContent: 'live' }] : []),
    ...upcoming.filter(i => i.liveBroadcastContent !== 'live'),
  ]

  return (
    <section id="schedule" className="schedule section">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">
            <FiCalendar />
            Schedule
          </div>
          <h2 className="section-title">Upcoming Streams</h2>
          <p className="section-subtitle">
            Mark your calendars — don&apos;t miss the onidragon&apos;s next adventure!
          </p>
        </div>

        {isMock && (
          <div className="schedule__mock-notice">
            ⚠️ Add <code>VITE_YOUTUBE_API_KEY</code> and <code>VITE_YOUTUBE_CHANNEL_ID</code> to
            your <code>.env</code> to load live schedule data from YouTube.
          </div>
        )}

        {loading ? (
          <div className="schedule__list">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="schedule__skeleton" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="schedule__empty glass-card">
            <SiYoutube size={32} />
            <p>No upcoming streams scheduled yet. Check back soon!</p>
            <a
              href="https://www.youtube.com/@ryutaamagiri"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: '8px', fontSize: '0.85rem' }}
            >
              <SiYoutube size={14} />
              Visit Channel
            </a>
          </div>
        ) : (
          <div className="schedule__list">
            {items.map((item, i) => (
              <ScheduleCard
                key={item.id?.videoId ?? i}
                item={item}
                index={i}
              />
            ))}
          </div>
        )}

        <div className="schedule__note">
          <p>All times in WIB (Western Indonesia Time / UTC+7) · Powered by YouTube</p>
        </div>
      </div>
    </section>
  )
}
