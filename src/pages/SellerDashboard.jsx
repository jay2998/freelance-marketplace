import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const SellerDashboard = () => {
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/gigs/my')
        setGigs(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gig?')) return
    try {
      await axiosInstance.delete(`/gigs/${id}`)
      setGigs(prev => prev.filter(g => g._id !== id))
      toast.success('Gig deleted')
    } catch (err) {
      toast.error('Could not delete gig')
    }
  }

  const handleLogout = async () => {
    await axiosInstance.post('/auth/logout')
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-green-600">FreelanceHub</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{currentUser?.username}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
          <Link to="/add" className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
            + New Gig
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">Total Gigs</p>
            <p className="text-2xl font-bold text-gray-800">{gigs.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-gray-800">{gigs.reduce((a, g) => a + g.sales, 0)}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ${gigs.reduce((a, g) => a + g.price * g.sales, 0)}
            </p>
          </div>
        </div>

        {/* Gigs Table */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">My Gigs</h2>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : gigs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
            <p className="text-gray-400 text-sm mb-4">No gigs yet</p>
            <Link to="/add" className="text-green-600 font-medium text-sm hover:underline">Create your first gig</Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Gig</th>
                  <th className="text-left p-4 font-medium text-gray-500">Category</th>
                  <th className="text-left p-4 font-medium text-gray-500">Price</th>
                  <th className="text-left p-4 font-medium text-gray-500">Sales</th>
                  <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map(gig => (
                  <tr key={gig._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={gig.cover} className="w-12 h-10 object-cover rounded-lg" alt="" />
                        <span className="font-medium text-gray-700 line-clamp-1 max-w-xs">{gig.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{gig.category}</td>
                    <td className="p-4 font-semibold text-green-600">${gig.price}</td>
                    <td className="p-4 text-gray-600">{gig.sales}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/gig/${gig._id}`} className="text-blue-500 hover:underline text-xs">View</Link>
                        <button onClick={() => handleDelete(gig._id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerDashboard