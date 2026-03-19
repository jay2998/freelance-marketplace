import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import Navbar from '../components/Navbar'
import GigCard from '../components/GigCard'

const CATEGORY_INFO = {
  design:      { label: 'Design',      emoji: '🎨', desc: 'Logos, branding, UI/UX and more' },
  development: { label: 'Development', emoji: '💻', desc: 'Web, mobile, and software development' },
  marketing:   { label: 'Marketing',   emoji: '📣', desc: 'SEO, social media, and paid ads' },
  writing:     { label: 'Writing',     emoji: '✍️',  desc: 'Copywriting, blogs, and content' },
  video:       { label: 'Video',       emoji: '🎬', desc: 'Editing, animation, and production' },
  music:       { label: 'Music',       emoji: '🎵', desc: 'Beats, mixing, and voiceovers' },
  business:    { label: 'Business',    emoji: '💼', desc: 'Consulting, finance, and strategy' },
  photography: { label: 'Photography', emoji: '📷', desc: 'Photo editing and retouching' },
}

const Category = () => {
  const { cat } = useParams()
  const navigate = useNavigate()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('createdAt')
  const [search, setSearch] = useState('')

  const key = cat?.toLowerCase()
  const info = CATEGORY_INFO[key] || { label: cat, emoji: '📦', desc: '' }

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get('/gigs', {
          params: {
            cat: info.label,
            sort,
            ...(search && { search }),
          }
        })
        setGigs(res.data)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGigs()
  }, [cat, sort, info.label])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/gigs', {
        params: {
          cat: info.label,
          sort,
          ...(search && { search }),
        }
      })
      setGigs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-green-600 mb-4 transition flex items-center gap-1">
            ← Back to Home
          </button>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{info.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{info.label}</h1>
              <p className="text-sm text-gray-400">{info.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Search in ${info.label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
            Search
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition">
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="sales">Best Selling</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <p className="text-sm text-gray-400 mb-6">
          {gigs.length} service{gigs.length !== 1 ? 's' : ''} available
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <p className="text-4xl mb-3">{info.emoji}</p>
            <p className="text-gray-500 font-medium">No gigs in {info.label} yet</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to offer a service here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gigs.map(gig => <GigCard key={gig._id} gig={gig} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Category