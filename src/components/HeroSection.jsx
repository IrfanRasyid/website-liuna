import { useMemo, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SiYoutube, SiDiscord } from 'react-icons/si'
import { FiExternalLink } from 'react-icons/fi'
import { useYouTubeData } from '../hooks/useYouTubeData.jsx'
import { formatSubscriberCount } from '../lib/youtube'
import charImg from '../assets/char.png'
import logoImg from '../assets/logo.png'
import './HeroSection.css'

export default function HeroSection() {
  const { stats, loading } = useYouTubeData()
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 768)
    checkDesktop()
    window.addEventListener('resize', checkDesktop, { passive: true })
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const { scrollY } = useScroll()

  // Scroll animations for desktop
  const bgTextY = useTransform(scrollY, [0, 800], [0, 350])
  const charY = useTransform(scrollY, [0, 800], [0, 150])
  const uiOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const uiY = useTransform(scrollY, [0, 400], [0, -30])

  const subscriberDisplay = useMemo(() => {
    if (loading) return '...'
    if (stats?.subscriberCount) return formatSubscriberCount(stats.subscriberCount)
    return '12.5K+'
  }, [stats, loading])

  const viewCount = useMemo(() => {
    if (loading || !stats?.viewCount) return '450K+'
    const n = parseInt(stats.viewCount)
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K+'
    return n.toString()
  }, [stats, loading])

  return (
    <section id="hero" className="hero">

      {/* ── BIG BACKGROUND NAME TEXT ── */}
      <motion.div
        className="hero__bg-text"
        aria-hidden="true"
        style={{ y: isDesktop ? bgTextY : 0 }}
      >
        <span className="hero__bg-word hero__bg-word--1">RYUTA</span>
        <span className="hero__bg-word hero__bg-word--2">AMAGIRI</span>
      </motion.div>

      {/* ── DECORATIVE UI SQUARES ── */}
      <motion.span className="hero__sq hero__sq--1" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />
      <motion.span className="hero__sq hero__sq--2" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />
      <motion.span className="hero__sq hero__sq--3" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />
      <motion.span className="hero__sq hero__sq--4" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />
      <motion.span className="hero__sq hero__sq--5" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />

      {/* ── CORNER BRACKETS ── */}
      <motion.div className="hero__bracket hero__bracket--tl" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />
      <motion.div className="hero__bracket hero__bracket--tr" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />
      <motion.div className="hero__bracket hero__bracket--bl" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />
      <motion.div className="hero__bracket hero__bracket--br" aria-hidden="true" style={isDesktop ? { opacity: uiOpacity } : {}} />

      {/* ── CHARACTER IMAGE ── */}
      <motion.div
        className="hero__char-wrap"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: isDesktop ? charY : 0 }}
      >
        <img
          src={charImg}
          alt="Ryuta Amagiri"
          className="hero__char-img"
          draggable={false}
        />
      </motion.div>

      {/* ══════════════════════════════════
          TOP-LEFT PANEL — Logo + channel
      ══════════════════════════════════ */}
      <motion.div
        className="hero__panel hero__panel--tl"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={isDesktop ? { opacity: uiOpacity, y: uiY } : {}}
      >
        <img src={logoImg} alt="Ryuta Amagiri" className="hero__logo-small" draggable={false} />
        <div className="hero__panel-line" />
        <div className="hero__channel-label">
          <span className="hero__channel-tag">INDIE VTUBER ID</span>
        </div>
      </motion.div>

      {/* ══════════════════════════════════
          TOP-RIGHT PANEL — Stats HUD
      ══════════════════════════════════ */}
      <motion.div
        className="hero__panel hero__panel--tr"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={isDesktop ? { opacity: uiOpacity, y: uiY } : {}}
      >
        <div className="hero__stat-row">
          <span className="hero__stat-key">SUBS</span>
          <span className="hero__stat-val">{subscriberDisplay}</span>
        </div>
        <div className="hero__stat-row">
          <span className="hero__stat-key">VIEWS</span>
          <span className="hero__stat-val">{viewCount}</span>
        </div>
        <div className="hero__stat-row">
          <span className="hero__stat-key">SINCE</span>
          <span className="hero__stat-val">2022</span>
        </div>
      </motion.div>

      {/* ══════════════════════════════════
          BOTTOM-LEFT PANEL — Bio + name stamp
      ══════════════════════════════════ */}
      <motion.div
        className="hero__panel hero__panel--bl"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={isDesktop ? { opacity: uiOpacity, y: uiY } : {}}
      >
        <div className="hero__name-stamp">
          <div className="hero__name-stamp-title">RYUTA AMAGIRI</div>
          <div className="hero__name-stamp-sub">雪山鬼龍</div>
        </div>
        <div className="hero__panel-line" />
        <p className="hero__bio-text">
          An indie male VTuber from Indonesia. Snow mountain onidragon who loves gaming
          and singing ❄️🐉
        </p>
        <div className="hero__social-row">
          <a
            href="https://www.youtube.com/@ryutaamagiri?sub_confirmation=1"
            target="_blank" rel="noopener noreferrer"
            className="hero__social-btn hero__social-btn--yt"
            id="hero-subscribe-btn"
          >
            <SiYoutube size={13} /> Subscribe
          </a>
          <a
            href="https://discord.gg/EBut2ReqTa"
            target="_blank" rel="noopener noreferrer"
            className="hero__social-btn hero__social-btn--dc"
            id="hero-discord-btn"
          >
            <SiDiscord size={13} /> Discord
          </a>
        </div>
      </motion.div>

      {/* ══════════════════════════════════
          BOTTOM-RIGHT PANEL — Tagline
      ══════════════════════════════════ */}
      <motion.div
        className="hero__panel hero__panel--br"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={isDesktop ? { opacity: uiOpacity, y: uiY } : {}}
      >
        <div className="hero__br-tag">SNOW MTN. ONIDRAGON</div>
        <p className="hero__br-quote">
          &ldquo;Ur snow mountain onidragon is here! Onigiri let&apos;s go!&rdquo;
        </p>
        <a
          href="https://www.youtube.com/@ryutaamagiri"
          target="_blank" rel="noopener noreferrer"
          className="hero__br-link"
          id="hero-channel-btn"
        >
          Visit Channel <FiExternalLink size={11} />
        </a>
      </motion.div>

      {/* ── CENTER BOTTOM — horizontal divider with label ── */}
      <motion.div
        className="hero__center-bar"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={isDesktop ? { opacity: uiOpacity, y: uiY } : {}}
      >
        <div className="hero__center-line" />
        <span className="hero__center-label">DEBUT · 12.03.2022</span>
        <div className="hero__center-line" />
      </motion.div>

    </section>
  )
}
