import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axiosInstance'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Orders = () => {
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/orders')
        setOrders(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleComplete = async (id) => {
    try {
      await axiosInstance.put(`/orders/${id}`)
      setOrders(prev => prev.map(o => o._id === id ? { ...o, isCompleted: true } : o))
      toast.success('Order marked as completed')
    } catch (err) {
      toast.error('Could not update order')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-600 cursor-pointer" onClick={() => navigate('/')}>FreelanceHub</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          {currentUser?.isSeller ? 'Orders Received' : 'My Orders'}
        </h1>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
            <p className="text-gray-400 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Gig</th>
                  <th className="text-left p-4 font-medium text-gray-500">Price</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  {currentUser?.isSeller && (
                    <th className="text-left p-4 font-medium text-gray-500">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={order.cover} className="w-12 h-10 object-cover rounded-lg" alt="" />
                        <span className="font-medium text-gray-700 line-clamp-1 max-w-xs">{order.title}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-green-600">${order.price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    {currentUser?.isSeller && (
                      <td className="p-4">
                        {!order.isCompleted && (
                          <button onClick={() => handleComplete(order._id)}
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                            Mark Complete
                          </button>
                        )}
                      </td>
                    )}
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

export default Orders