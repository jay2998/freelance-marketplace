import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axiosInstance.post('/auth/login', form)
      setCurrentUser(res.data)
      toast.success(`Welcome back, ${res.data.username}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
            <input name="username" placeholder="johndoe" onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60 mt-1">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login