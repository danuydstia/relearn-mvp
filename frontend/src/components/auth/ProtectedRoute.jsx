import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner.jsx'

/**
 * ProtectedRoute — guards authenticated app routes.
 * Shows a canvas spinner while the session is resolving, then either
 * renders the page or redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f7f3]">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
