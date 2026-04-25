import { motion } from 'framer-motion'
import charSheetImg from '../assets/charsheet.jpg'
import './CharacterSheetSection.css'

export default function CharacterSheetSection() {
  return (
    <section id="charsheet" className="charsheet section">
      {/* Background Watermark Text */}
      <div className="watermark-text charsheet__watermark-1">LIUNA</div>
      <div className="watermark-text charsheet__watermark-2">AUSTELLA</div>

      {/* Decorative Accent Squares */}
      <div className="charsheet__sq charsheet__sq--1" />
      <div className="charsheet__sq charsheet__sq--2" />
      <div className="charsheet__sq charsheet__sq--3" />

      <div className="container charsheet__container">

        {/* Staggered Typography Header */}
        <div className="charsheet__header-group">
          <motion.div
            className="charsheet__title-word charsheet__title-word--1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            CHARACTER
          </motion.div>
          <motion.div
            className="charsheet__title-word charsheet__title-word--2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
          >
            SHEET
          </motion.div>
        </div>

        {/* The Image Viewer */}
        <motion.div
          className="charsheet__image-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Corner Brackets */}
          <div className="charsheet__bracket charsheet__bracket--tl" />
          <div className="charsheet__bracket charsheet__bracket--tr" />
          <div className="charsheet__bracket charsheet__bracket--bl" />
          <div className="charsheet__bracket charsheet__bracket--br" />

          <img
            src={charSheetImg}
            alt="Liuna Austella Character Sheet"
            className="charsheet__img"
            loading="lazy"
          />

          <div className="charsheet__img-label">
            ART BY @MashuAko
          </div>
        </motion.div>
      </div>
    </section>
  )
}
