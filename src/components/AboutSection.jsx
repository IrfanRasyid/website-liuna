import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { GiLightningTrio, GiStarSwirl } from 'react-icons/gi'
import { FaHeart, FaBolt } from 'react-icons/fa'
import aboutImg from '../assets/about.png'
import './AboutSection.css'

const traits = [
  { icon: FaBolt, label: 'Chaotic Bunny', desc: 'Electric bunny ready to shake up your heart' },
  { icon: GiStarSwirl, label: 'Electric Energy', desc: 'Full of chaotic sparks and charm' },
  { icon: FiMapPin, label: 'Indonesia', desc: 'Indie VTuber ID scene' },
  { icon: FaHeart, label: 'Lovaliu', desc: 'Fans called Lovaliu 🐰' },
]

export default function AboutSection() {
  return (
    <section id="about" className="about section">
      
      {/* Background Watermark */}
      <div className="watermark-text about__watermark">LIUNA</div>

      <div className="container">
        
        {/* Staggered Section Header */}
        <div className="about__header">
          <h2 className="about__title">
            <span className="about__title-line about__title-line--1">ABOUT</span>
            <span className="about__title-line about__title-line--2">LIUNA</span>
          </h2>
          <div className="about__subtitle-box">
            Your Chaotic Bunny who emerged to shake up your heart.
          </div>
        </div>

        <div className="about__content">
          
          {/* LEFT: Character visual cut-out */}
          <motion.div 
            className="about__visual"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="about__visual-bg" />
            <img src={aboutImg} alt="Liuna" className="about__visual-img" />
            <div className="about__visual-tag">DEBUT 2022</div>
          </motion.div>

          {/* RIGHT: Traits Grid */}
          <motion.div 
            className="about__info"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="about__traits">
              {traits.map((trait, i) => (
                <div key={i} className="about__trait-card">
                  <div className="about__trait-icon-wrap">
                    <trait.icon size={24} className="about__trait-icon" />
                  </div>
                  <div className="about__trait-text">
                    <div className="about__trait-label">{trait.label}</div>
                    <div className="about__trait-desc">{trait.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="about__lore">
              <p>
                As an independent VTuber, Liuna brings electric chaotic energy 
                and the warmth of the Lovaliu family together. Her streams are always full of charm and surprises!
              </p>
            </div>
            
            <div className="about__lore-decor">
              <span className="about__sq-decor" />
              <span className="about__sq-decor" />
              <span className="about__sq-decor" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
