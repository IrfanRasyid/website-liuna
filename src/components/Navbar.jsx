import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SiYoutube, SiDiscord } from 'react-icons/si'
import { useYouTubeData } from '../hooks/useYouTubeData.jsx'
import { formatSubscriberCount } from '../lib/youtube'
import logoImg from '../assets/logo.png'
import './Navbar.css'

const tabs = [
  { label: 'Home', emoji: '🏠', href: '#hero' },
  { label: 'About', emoji: '🐰', href: '#about' },
  { label: 'Ref', emoji: '🖼️', href: '#charsheet' },
  { label: 'Support', emoji: '🎁', href: '#support' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const { stats, loading } = useYouTubeData()

  const subCount = !loading && stats?.subscriberCount
    ? formatSubscriberCount(stats.subscriberCount)
    : '12.5K'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (href, index) => {
    setActiveTab(index)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Top Resource Bar ── */}
      <motion.div
        className={`top-bar ${scrolled ? 'top-bar--scrolled' : ''}`}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <button
          className="top-bar__logo"
          onClick={() => handleNav('#hero', 0)}
          aria-label="Go to top"
        >
          <img
            src={logoImg}
            alt="Liuna Austella"
            className="top-bar__logo-img"
            draggable={false}
          />
        </button>

        {/* Resource counters */}
        <div className="top-bar__resources">
          <div className="top-bar__resource top-bar__resource--sub">
            <div className="top-bar__resource-icon">
              <SiYoutube size={12} color="#fff" />
            </div>
            <span>{subCount}</span>
          </div>
          <div className="top-bar__resource top-bar__resource--discord">
            <div className="top-bar__resource-icon">
              <SiDiscord size={12} color="#fff" />
            </div>
            <span>Join</span>
          </div>
          <a
            href="https://www.youtube.com/@Liuna_Austella?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="top-bar__menu-btn"
            aria-label="Subscribe"
          >
            ☆
          </a>
        </div>
      </motion.div>

      {/* ── Bottom Tab Bar ── */}
      <motion.nav
        className="bottom-tab-bar"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Main navigation"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            id={`nav-tab-${i}`}
            className={`bottom-tab-bar__tab ${activeTab === i ? 'bottom-tab-bar__tab--active' : ''}`}
            onClick={() => handleNav(tab.href, i)}
          >
            <div className="bottom-tab-bar__dot" aria-hidden="true" />
            <span className="bottom-tab-bar__icon">{tab.emoji}</span>
            <span className="bottom-tab-bar__label">{tab.label}</span>
          </button>
        ))}

        {/* Subscribe CTA slot */}
        <a
          href="https://www.youtube.com/@Liuna_Austella?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="bottom-tab-bar__subscribe"
          id="nav-subscribe-btn"
        >
          <span className="bottom-tab-bar__subscribe-icon">
            <SiYoutube size={16} />
          </span>
          <span>Subscribe</span>
        </a>
      </motion.nav>
    </>
  )
}
