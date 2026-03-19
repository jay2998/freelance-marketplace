import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const GigDetail = () => {
  const { id } = useParams()
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()
  const [gig, setGig] = useState(null)
  const [activeImg, setActiveImg] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ star: 5, desc: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gigRes, reviewRes] = await Promise.all([
          axiosInstance.get(`/gigs/single/${id}`),
          axiosInstance.get(`/reviews/${id}`)
        ])
        setGig(gigRes.data)
        setActiveImg(gigRes.data.cover)
        setReviews(reviewRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [id])

  const handleOrder = async () => {
    if (!currentUser) return navigate('/login')
    setOrdering(true)
    try {
      await axiosInstance.post(`/orders/${id}`)
      toast.success('Order placed!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data || 'Could not place order')
    } finally {
      setOrdering(false)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await axiosInstance.post('/reviews', {
        gigId: id,
        ...reviewForm
      })
      setReviews(prev => [res.data, ...prev])
      setReviewForm({ star: 5, desc: '' })
      toast.success('Review submitted!')
    } catch (err) {
      toast.error(err.response?.data || 'Could not submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!gig) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center py-20 text-gray-400">Loading...</p>
    </div>
  )

  const avg = gig.starNumber > 0
    ? (gig.totalStars / gig.starNumber).toFixed(1)
    : null

  const isOwner = currentUser?._id === gig.userId

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left */}
        <div className="md:col-span-2">
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{gig.category}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{gig.title}</h1>

          <img src={activeImg} className="w-full h-72 object-cover rounded-xl mb-3" alt="" />
          <div className="flex gap-2 mb-8 flex-wrap">
            {[gig.cover, ...(gig.images || [])].map((img, i) => (
              <img key={i} src={img} onClick={() => setActiveImg(img)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition
                  ${activeImg === img ? 'border-green-500' : 'border-transparent'}`} alt="" />
            ))}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-3">About this gig</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">{gig.desc}</p>

          {/* Reviews */}
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Reviews
              {avg && (
                <span className="ml-2 text-yellow-500 text-base">
                  ★ {avg}
                  <span className="text-gray-400 text-sm ml-1">({gig.starNumber})</span>
                </span>
              )}
            </h2>

            {/* Review form — only buyers can review */}
            {currentUser && !isOwner && (
              <form onSubmit={handleReview}
                className="bg-white border border-gray-100 rounded-xl p-5 mb-6 flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-700">Leave a review</p>
                <select
                  value={reviewForm.star}
                  onChange={(e) => setReviewForm({ ...reviewForm, star: Number(e.target.value) })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition">
                  <option value={5}>★★★★★ — Excellent</option>
                  <option value={4}>★★★★☆ — Good</option>
                  <option value={3}>★★★☆☆ — Average</option>
                  <option value={2}>★★☆☆☆ — Poor</option>
                  <option value={1}>★☆☆☆☆ — Terrible</option>
                </select>
                <textarea
                  value={reviewForm.desc}
                  onChange={(e) => setReviewForm({ ...reviewForm, desc: e.target.value })}
                  placeholder="Share your experience..."
                  rows={3} required
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition resize-none" />
                <button type="submit" disabled={submitting}
                  className="bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map(r => (
                  <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-500 text-sm">
                        {'★'.repeat(r.star)}{'☆'.repeat(5 - r.star)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{r.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Order Card */}
        <div className="border border-gray-100 bg-white rounded-2xl p-6 h-fit sticky top-6 shadow-sm">
          <p className="text-3xl font-bold text-green-600 mb-1">${gig.price}</p>
          <p className="text-sm text-gray-400 mb-2">
            Delivery in {gig.deliveryTime} day{gig.deliveryTime > 1 ? 's' : ''}
          </p>
          {avg && (
            <div className="flex items-center gap-1 text-yellow-500 text-sm mb-4">
              <span>★ {avg}</span>
              <span className="text-gray-400">({gig.starNumber} reviews)</span>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6 line-clamp-3">{gig.desc}</p>
          {!isOwner && (
            <button onClick={handleOrder} disabled={ordering}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50">
              {ordering ? 'Placing order...' : `Order Now — $${gig.price}`}
            </button>
          )}
          {isOwner && (
            <p className="text-xs text-center text-gray-400">This is your gig</p>
          )}
          <p className="text-xs text-center text-gray-400 mt-3">You won't be charged yet</p>
        </div>
      </div>
    </div>
  )
}

export default GigDetail