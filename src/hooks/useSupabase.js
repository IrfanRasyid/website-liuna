import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Mock fan art data for when Supabase is not configured
const MOCK_FAN_ARTS = [
  { id: '1', title: 'Ryuta in Snowstorm', artist_name: 'IceArtist', image_url: 'https://picsum.photos/seed/fa1/400/500', created_at: '2024-11-01' },
  { id: '2', title: 'Oni Dragon Form', artist_name: 'DragonSketch', image_url: 'https://picsum.photos/seed/fa2/400/600', created_at: '2024-10-15' },
  { id: '3', title: 'Chibi Ryuta ❄️', artist_name: 'ChibiArts', image_url: 'https://picsum.photos/seed/fa3/400/400', created_at: '2024-10-10' },
  { id: '4', title: 'Mountain Peak', artist_name: 'MountainDraw', image_url: 'https://picsum.photos/seed/fa4/400/550', created_at: '2024-09-20' },
  { id: '5', title: 'Ryuta Full Art', artist_name: 'FullColorArt', image_url: 'https://picsum.photos/seed/fa5/400/480', created_at: '2024-09-05' },
  { id: '6', title: 'Snow Night', artist_name: 'NightArts', image_url: 'https://picsum.photos/seed/fa6/400/520', created_at: '2024-08-25' },
]

// Mock schedule data
const MOCK_SCHEDULE = [
  { id: '1', title: 'Late Night Minecraft', game: 'Minecraft', scheduled_at: new Date(Date.now() + 3600000 * 6).toISOString(), status: 'upcoming' },
  { id: '2', title: 'Ranked Apex with Friends', game: 'Apex Legends', scheduled_at: new Date(Date.now() + 3600000 * 30).toISOString(), status: 'upcoming' },
  { id: '3', title: 'Chill Zatsu Talk', game: 'Just Chatting', scheduled_at: new Date(Date.now() + 3600000 * 54).toISOString(), status: 'upcoming' },
  { id: '4', title: 'Genshin Exploration', game: 'Genshin Impact', scheduled_at: new Date(Date.now() + 3600000 * 78).toISOString(), status: 'upcoming' },
]

export function useFanArts() {
  const [fanArts, setFanArts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setFanArts(MOCK_FAN_ARTS)
        setIsMock(true)
        setLoading(false)
      }, 600)
      return
    }

    const fetchArts = async () => {
      const { data, error } = await supabase
        .from('fan_arts')
        .select('id, title, artist_name, image_url, source_url, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fan_arts error:', error)
        setFanArts(MOCK_FAN_ARTS)
        setIsMock(true)
      } else {
        setFanArts(data.length > 0 ? data : MOCK_FAN_ARTS)
      }
      setLoading(false)
    }

    fetchArts()
  }, [])

  return { fanArts, loading, isMock }
}

export function useSchedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSchedule(MOCK_SCHEDULE)
        setLoading(false)
      }, 600)
      return
    }

    const fetchSchedule = async () => {
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(8)

      if (error) {
        console.error('Supabase schedule error:', error)
        setSchedule(MOCK_SCHEDULE)
      } else {
        setSchedule(data.length > 0 ? data : MOCK_SCHEDULE)
      }
      setLoading(false)
    }

    fetchSchedule()
  }, [])

  return { schedule, loading }
}
