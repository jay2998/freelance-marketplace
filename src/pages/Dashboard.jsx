import { useAuthStore } from '../store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
      logout()
      toast.success('Logged out')
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-green-600">FreelanceHub</Link>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 transition">
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-600">
            {currentUser?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{currentUser?.username}</h2>
            <p className="text-sm text-gray-400">{currentUser?.email}</p>
            <p className="text-sm text-gray-400">{currentUser?.country}</p>
            <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block font-medium ${
              currentUser?.isSeller ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {currentUser?.isSeller ? 'Seller' : 'Buyer'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentUser?.isSeller && (
            <Link to="/add" className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-green-200 transition">
              <p className="font-semibold text-gray-800 mb-1">+ Create a Gig</p>
              <p className="text-sm text-gray-400">Post a new service for buyers</p>
            </Link>
          )}
          <Link to="/" className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-green-200 transition">
            <p className="font-semibold text-gray-800 mb-1">Browse Gigs</p>
            <p className="text-sm text-gray-400">Find services you need</p>
          </Link>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <p className="font-semibold text-gray-800 mb-1">My Orders</p>
            <p className="text-sm text-gray-400">No orders yet</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <p className="font-semibold text-gray-800 mb-1">Messages</p>
            <p className="text-sm text-gray-400">No messages yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard