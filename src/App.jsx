import './index.css'
import { YouTubeProvider } from './hooks/useYouTubeData.jsx'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import CharacterSheetSection from './components/CharacterSheetSection'
import SupportSection from './components/SupportSection'
import Footer from './components/Footer'

function App() {
  return (
    <YouTubeProvider>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <CharacterSheetSection />
        <SupportSection />
      </main>
      <Footer />
    </YouTubeProvider>
  )
}

export default App
