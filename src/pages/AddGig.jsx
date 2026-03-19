import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import toast from 'react-hot-toast'

const CATEGORIES = ['Design', 'Development', 'Marketing', 'Writing', 'Video', 'Music', 'Business', 'Photography']

const AddGig = () => {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '', desc: '', category: 'Design',
    price: '', deliveryTime: '', cover: '', images: []
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const uploadImage = (file) => new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const res = await axiosInstance.post('/gigs/upload', { image: reader.result })
      resolve(res.data)
    }
  })

  const handleCover = async (e) => {
    setUploading(true)
    const url = await uploadImage(e.target.files[0])
    setForm(prev => ({ ...prev, cover: url }))
    setUploading(false)
  }

  const handleImages = async (e) => {
    setUploading(true)
    const urls = await Promise.all(Array.from(e.target.files).map(uploadImage))
    setForm(prev => ({ ...prev, images: urls }))
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/gigs', {
        ...form,
        price: Number(form.price),
        deliveryTime: Number(form.deliveryTime)
      })
      toast.success('Gig created!')
      navigate('/seller-dashboard')
    } catch (err) {
      toast.error(err.response?.data || 'Failed to create gig')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-600">FreelanceHub</h1>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Create a New Gig</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
            <input name="title" onChange={handleChange} placeholder="I will design a modern logo..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea name="desc" onChange={handleChange} rows={4} placeholder="Describe your service in detail..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition resize-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select name="category" onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Price ($)</label>
              <input name="price" type="number" min="1" onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Delivery Time (days)</label>
            <input name="deliveryTime" type="number" min="1" onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition" required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCover}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:text-sm hover:file:bg-green-100" />
            {form.cover && <img src={form.cover} className="mt-2 h-32 w-full object-cover rounded-lg" alt="cover" />}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Additional Images <span className="text-gray-400">(optional)</span></label>
            <input type="file" accept="image/*" multiple onChange={handleImages}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:text-sm hover:file:bg-green-100" />
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.images.map((img, i) => (
                <img key={i} src={img} className="h-16 w-16 object-cover rounded-lg" alt="" />
              ))}
            </div>
          </div>

          {uploading && <p className="text-sm text-gray-400">Uploading images...</p>}

          <button type="submit" disabled={uploading || !form.cover}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
            Publish Gig
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddGig