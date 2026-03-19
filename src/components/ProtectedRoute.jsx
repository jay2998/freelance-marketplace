import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const ProtectedRoute = ({ children, sellerOnly = false }) => {
  const { currentUser } = useAuthStore()

  if (!currentUser) return <Navigate to="/login" />
  if (sellerOnly && !currentUser.isSeller) return <Navigate to="/" />

  return children
}

export default ProtectedRoute