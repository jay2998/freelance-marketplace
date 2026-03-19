import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { axiosInstance } from '../api/axiosInstance'
import toast from 'react-hot-toast'

const Navbar = () => {
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
    <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-green-600">FreelanceHub</Link>
      <div className="flex items-center gap-5">
        {currentUser ? (
          <>
            <span className="text-sm text-gray-500">Hi, {currentUser.username}</span>
            {currentUser.isSeller && (
              <Link to="/seller-dashboard" className="text-sm text-gray-600 hover:text-green-600 transition">
                My Gigs
              </Link>
            )}
            <Link to="/orders" className="text-sm text-gray-600 hover:text-green-600 transition">
              Orders
            </Link>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-green-600 transition">
              Dashboard
            </Link>
            <button onClick={handleLogout}
              className="text-sm bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-green-600 transition">
              Sign In
            </Link>
            <Link to="/register"
              className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Join
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar