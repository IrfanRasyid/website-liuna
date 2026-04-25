import { SiYoutube, SiX, SiInstagram, SiDiscord, SiTiktok } from 'react-icons/si'
import { GiSnowflake1 } from 'react-icons/gi'
import logoImg from '../assets/logo.png'
import './Footer.css'

const footerSocials = [
  { icon: SiYoutube, href: 'https://www.youtube.com/@ryutaamagiri', label: 'YouTube' },
  { icon: SiX, href: 'https://twitter.com/ryutaamagiri', label: 'Twitter' },
  { icon: SiInstagram, href: 'https://www.instagram.com/ryutaamagirii', label: 'Instagram' },
  { icon: SiDiscord, href: 'https://discord.gg/EBut2ReqTa', label: 'Discord' },
  { icon: SiTiktok, href: 'https://www.tiktok.com/@ryutaamagiri', label: 'TikTok' },
]

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Ref Sheet', href: '#charsheet' },
  { label: 'Videos', href: '#videos' },
  { label: 'Fan Art', href: '#fanart' },
  { label: 'Support', href: '#support' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const handleNav = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container footer__inner">

        {/* Left: Brand */}
        <div className="footer__brand">
          <img src={logoImg} alt="Ryuta Amagiri" className="footer__logo-img" draggable={false} />
          <p className="footer__tagline">Ur snow mountain onidragon is here! 🏔️❄️</p>
          <div className="footer__socials">
            {footerSocials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Right: Links */}
        <div className="footer__nav-groups">
          <nav className="footer__nav">
            <div className="footer__nav-title">Navigation</div>
            <ul className="footer__nav-links">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button className="footer__nav-link" onClick={() => handleNav(link.href)}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__support-group">
            <div className="footer__nav-title">Support</div>
            <div className="footer__support-links">
              <a href="https://trakteer.id/ryutaamagiri/tip" target="_blank" rel="noopener noreferrer" className="footer__support-link">
                Trakteer
              </a>
              <a href="https://tiptap.gg/ryutaamagiri" target="_blank" rel="noopener noreferrer" className="footer__support-link">
                TipTap
              </a>
              <a href="https://tako.id/RyutaAmagiri" target="_blank" rel="noopener noreferrer" className="footer__support-link">
                Tako
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {year} Ryuta Amagiri. All rights reserved.
          </p>
          <p className="footer__disclaimer">
            This is a personal website for Ryuta Amagiri.
          </p>
        </div>
      </div>

      {/* Huge Background Decor */}
      <div className="footer__bg-decor">AMAGIRI</div>
    </footer>
  )
}
