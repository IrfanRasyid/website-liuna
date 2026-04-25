import { motion } from 'framer-motion'
import { FiExternalLink } from 'react-icons/fi'
import './SupportSection.css'

const supportLinks = [
  {
    id: 'trakteer',
    name: 'Trakteer',
    desc: 'Support with a virtual cup of coffee ☕',
    href: 'https://trakteer.id/liuna_austella/gift',
    emoji: '🎁',
    color: '#e85d04',
  },
  {
    id: 'buylink',
    name: 'Buylink',
    desc: 'Support & get exclusive merch 🛒',
    href: 'https://idol.buylink.id/LiunaAustella',
    emoji: '🛒',
    color: '#2ecc71',
  },
  {
    id: 'tako',
    name: 'Tako.id',
    desc: 'Support the daily stream grind 🐙',
    href: 'https://tako.id/LiunaBwaBwa',
    emoji: '🐙',
    color: '#9d4edd',
  },
  {
    id: 'tiptap',
    name: 'TipTap',
    desc: 'Quick and easy direct tips 💸',
    href: 'https://tiptap.gg/liuna_austella',
    emoji: '💰',
    color: '#00b4d8',
  },
  {
    id: 'sociabuzz',
    name: 'Sociabuzz',
    desc: 'Join the tribe and support! ⚡',
    href: 'https://sociabuzz.com/liunaaustella/tribe',
    emoji: '⚡',
    color: '#f1c40f',
  },
]

export default function SupportSection() {
  return (
    <section id="support" className="support section">
      
      {/* Background Watermark */}
      <div className="watermark-text support__watermark">SUPPORT</div>

      <div className="container">
        
        {/* Staggered Section Header */}
        <div className="support__header">
          <h2 className="support__title">
            <span className="support__title-line support__title-line--1">SUPPORT</span>
            <span className="support__title-line support__title-line--2">LIUNA</span>
          </h2>
          <div className="support__subtitle-box">
            Every bit of support helps the stream grow! Thank you Lovaliu! 🐰⚡
          </div>
        </div>

        <div className="support__grid">
          {supportLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="support-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="support-card__inner">
                <div 
                  className="support-card__icon-box"
                  style={{ backgroundColor: link.color }}
                >
                  {link.emoji}
                </div>
                <div className="support-card__content">
                  <h3 className="support-card__title" style={{ color: link.color }}>
                    {link.name}
                  </h3>
                  <p className="support-card__desc">{link.desc}</p>
                </div>
                <div className="support-card__action">
                  <FiExternalLink size={20} color={link.color} />
                </div>
              </div>
              {/* Decorative side accent */}
              <div className="support-card__accent" style={{ backgroundColor: link.color }} />
            </motion.a>
          ))}
        </div>

        {/* Decorative Quote Panel */}
        <motion.div 
          className="support__quote-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="support__quote-text">
            "Your presence in the stream is the best support I could ask for. Let's make more memories together!"
          </div>
          <div className="support__quote-author">— Liuna Austella</div>
        </motion.div>
      </div>
    </section>
  )
}
