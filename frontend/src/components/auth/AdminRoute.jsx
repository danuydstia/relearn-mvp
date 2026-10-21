import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner.jsx'

/**
 * AdminRoute — guards the admin console.
 *
 * Resolves the session first (same spinner as ProtectedRoute), sends guests to
 * the login screen, and shows an explicit refusal to signed-in students rather
 * than redirecting behind their back.
 */
export default function AdminRoute({ children }) {
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

  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f7f3] px-6">
        <div className="w-full max-w-[420px] rounded-[12px] border border-[#dad9d4] bg-white p-8 text-center">
          <p className="text-[20px] font-bold text-[#17191f]">Admins only</p>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#686b73]">
            This console is limited to the Re:Learn team.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-[6px] bg-[#0033ff] px-5 text-[12px] font-semibold text-white"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return children
}
