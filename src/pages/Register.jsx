import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    country: '', isSeller: false, desc: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axiosInstance.post('/auth/register', form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create an account</h1>
        <p className="text-sm text-gray-400 mb-6">Join thousands of freelancers today</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
            <input name="username" placeholder="johndoe" onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input name="email" type="email" placeholder="john@email.com" onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Country</label>
            <input name="country" placeholder="Pakistan" onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Bio <span className="text-gray-400">(optional)</span>
            </label>
            <textarea name="desc" placeholder="Tell clients about yourself..."
              onChange={handleChange} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="isSeller" type="checkbox" onChange={handleChange}
              className="w-4 h-4 accent-green-500" />
            <span className="text-sm text-gray-700">Activate seller account</span>
          </label>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60 mt-1">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register