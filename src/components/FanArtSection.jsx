import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { useFanArts } from '../hooks/useSupabase'
import './FanArtSection.css'

export default function FanArtSection() {
  const { fanArts, loading } = useFanArts()

  return (
    <section id="fanart" className="fanart section">
      
      {/* Background Watermark */}
      <div className="watermark-text fanart__watermark">GALLERY</div>

      <div className="container">
        
        {/* Staggered Section Header */}
        <div className="fanart__header">
          <div className="fanart__header-left">
            <h2 className="fanart__title">
              <span className="fanart__title-line fanart__title-line--1">ONIGIRI</span>
              <span className="fanart__title-line fanart__title-line--2">GALLERY</span>
            </h2>
            <div className="fanart__subtitle-box">
              Beautiful artworks from the Onigiri family
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="fanart__grid">
          {loading ? (
            <div className="fanart__loading">Loading masterpieces...</div>
          ) : fanArts.length === 0 ? (
            <div className="fanart__empty">
              <div className="fanart__empty-icon"><FiHeart size={40} /></div>
              <p>No fan arts yet! Be the first to submit yours.</p>
            </div>
          ) : (
            fanArts.map((art) => (
              <motion.div 
                key={art.id} 
                className="fanart-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <img src={art.image_url} alt={`Fanart by ${art.author_name || art.artist_name}`} loading="lazy" />
                <div className="fanart-card__overlay">
                  <div className="fanart-card__author">{art.author_name || art.artist_name}</div>
                  {art.source_url && (
                    <a href={art.source_url} target="_blank" rel="noopener noreferrer" className="fanart-card__link">
                      Visit Artist
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
