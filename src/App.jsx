import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AddGig from './pages/AddGig'
import GigDetail from './pages/GigDetail'
import SellerDashboard from './pages/SellerDashboard'
import Orders from './pages/Orders'
import Category from './pages/Category'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/gig/:id"      element={<GigDetail />} />
        <Route path="/category/:cat" element={<Category />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/seller-dashboard" element={
          <ProtectedRoute sellerOnly><SellerDashboard /></ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute sellerOnly><AddGig /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App