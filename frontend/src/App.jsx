import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './utils/store'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import HomePage from './pages/HomePage'

function App() {
  const { user, isAuthenticated } = useAuthStore()

  const PrivateRoute = ({ children, roles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    if (roles && user?.role_name && !roles.includes(user.role_name)) {
      return <Navigate to="/dashboard" replace />
    }

    return children
  }

  const DashboardRoute = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    if (user?.role_name === 'admin' || user?.role_name === 'staff') {
      return <Navigate to="/admin" replace />
    }

    return <Navigate to="/user" replace />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardRoute />} />

      <Route
        path="/admin/*"
        element={
          <PrivateRoute roles={['admin', 'staff']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/user/*"
        element={
          <PrivateRoute roles={['voter', 'party']}>
            <UserDashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
