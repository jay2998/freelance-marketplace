import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import GigCard from '../components/GigCard'

const CATEGORIES = [
  { name: 'Design',      emoji: '🎨' },
  { name: 'Development', emoji: '💻' },
  { name: 'Marketing',   emoji: '📣' },
  { name: 'Writing',     emoji: '✍️'  },
  { name: 'Video',       emoji: '🎬' },
  { name: 'Music',       emoji: '🎵' },
  { name: 'Business',    emoji: '💼' },
  { name: 'Photography', emoji: '📷' },
]

const Home = () => {
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()
  const [gigs, setGigs] = useState([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get('/gigs', {
          params: {
            ...(category && { cat: category }),
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
    fetchGigs()
  }, [category, search])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-green-600 text-white py-24 px-8 text-center">
        <h2 className="text-4xl font-bold mb-3">Find the perfect freelance service</h2>
        <p className="text-lg opacity-90 mb-8">Thousands of talented freelancers ready to help</p>
        <div className="flex max-w-lg mx-auto gap-2">
          <input
            type="text"
            placeholder="Search for any service..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearch(input)}
            className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 outline-none text-sm"
          />
          <button
            onClick={() => setSearch(input)}
            className="bg-green-800 px-6 py-3 rounded-r-lg hover:bg-green-900 transition font-medium">
            Search
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Browse by category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat.name}
              onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-white border-gray-100 hover:border-green-300 hover:shadow-sm text-gray-700 transition cursor-pointer">
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gigs */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {search ? `Results for "${search}"` : 'All Gigs'}
          </h3>
          {search && (
            <button onClick={() => { setSearch(''); setInput('') }}
              className="text-sm text-green-600 hover:underline">
              Clear search
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No gigs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gigs.map(gig => <GigCard key={gig._id} gig={gig} />)}
          </div>
        )}
      </div>

      {/* CTA */}
      {!currentUser && (
        <div className="bg-green-50 border-t border-green-100 py-16 text-center px-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to get started?</h3>
          <p className="text-gray-400 text-sm mb-6">Join thousands of freelancers and clients today</p>
          <button onClick={() => navigate('/register')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium">
            Create an Account
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
