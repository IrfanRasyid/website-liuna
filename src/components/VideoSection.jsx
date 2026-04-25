import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SiYoutube } from 'react-icons/si'
import { FiExternalLink, FiPlay, FiClock, FiRadio } from 'react-icons/fi'
import { useYouTubeData } from '../hooks/useYouTubeData.jsx'
import { watchUrl } from '../lib/youtube'
import './VideoSection.css'

const TABS = ['Recent Videos', 'Recent Streams']

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function VideoCard({ video, index }) {
  const { snippet, id } = video
  const href = watchUrl(id)

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="video-card glass-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <div className="video-card__thumb">
        <img
          src={snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url}
          alt={snippet.title}
          loading="lazy"
        />
        <div className="video-card__play-overlay">
          <FiPlay size={20} />
        </div>
        <div className="video-card__duration-badge">
          <FiClock size={10} />
          Watch
        </div>
      </div>
      <div className="video-card__info">
        <h3 className="video-card__title">{snippet.title}</h3>
        <div className="video-card__meta">
          <span className="video-card__date">{formatDate(snippet.publishedAt)}</span>
          <span className="video-card__link">
            <FiExternalLink size={12} />
          </span>
        </div>
      </div>
    </motion.a>
  )
}

function LiveBanner({ liveStream }) {
  if (!liveStream) return null
  const href = watchUrl(liveStream.id)
  
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="live-banner"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="live-banner__indicator">
        <FiRadio size={20} />
        <span className="live-banner__pulse" />
      </div>
      <div className="live-banner__content">
        <div className="live-banner__tag">LIVE NOW</div>
        <div className="live-banner__title">{liveStream.snippet.title}</div>
      </div>
      <div className="live-banner__cta">
        WATCH <FiExternalLink size={14} />
      </div>
    </motion.a>
  )
}

export default function VideoSection() {
  const [activeTab, setActiveTab] = useState(0)
  const { videos, streams, liveStream, loading, isMock } = useYouTubeData()

  const currentList = activeTab === 0 ? videos : streams
  const showList = currentList.length > 0 ? currentList : []

  return (
    <section id="videos" className="videos section">
      
      {/* Background Watermark */}
      <div className="watermark-text videos__watermark">YOUTUBE</div>

      <div className="container">
        
        {/* Staggered Section Header */}
        <div className="videos__header">
          <h2 className="videos__title">
            <span className="videos__title-line videos__title-line--1">LATEST</span>
            <span className="videos__title-line videos__title-line--2">CONTENT</span>
          </h2>
          <div className="videos__subtitle-box">
            {isMock ? 'Preview Mode (Mock Data)' : 'Directly from the channel'}
          </div>
        </div>

        {/* Live Banner */}
        <LiveBanner liveStream={liveStream} />

        {/* Tabs */}
        <div className="videos__tabs-wrap">
          <div className="videos__tabs">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                className={`videos__tab ${activeTab === i ? 'videos__tab--active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
                {activeTab === i && (
                  <motion.div
                    className="videos__tab-indicator"
                    layoutId="video-tab-indicator"
                  />
                )}
              </button>
            ))}
          </div>
          <a
            href="https://www.youtube.com/@ryutaamagiri"
            target="_blank"
            rel="noopener noreferrer"
            className="videos__yt-btn"
          >
            <SiYoutube size={16} /> Channel
          </a>
        </div>

        {/* Video Grid */}
        <div className="videos__grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="video-card glass-card skeleton" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {showList.map((video, index) => (
                <VideoCard key={video.id?.videoId || index} video={video} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  )
}
