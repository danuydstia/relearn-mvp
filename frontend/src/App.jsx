import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm.jsx'
import RegisterForm from './components/auth/RegisterForm.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import AuthLayout from './components/layout/AuthLayout.jsx'
import AppShell from './components/layout/AppShell.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import AdminRoute from './components/auth/AdminRoute.jsx'
import AdminOverviewPage from './pages/admin/AdminOverviewPage.jsx'
import AdminUnavailablePage from './pages/admin/AdminUnavailablePage.jsx'
import { ADMIN_OVERVIEW_PATH, ADMIN_PENDING_ITEMS, landingPathFor } from './lib/adminNavigation'
import { useAuth } from './contexts/AuthContext'

// ─── Inline handler untuk Google callback (tanpa halaman terpisah) ───
function GoogleCallbackHandler() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const auth = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const status = searchParams.get('status')
    const message = searchParams.get('message')

    if (status === 'error') {
      setError(message || 'Google authentication failed')
      const t = setTimeout(() => navigate('/login'), 2500)
      return () => clearTimeout(t)
    }

    if (!token) {
      navigate('/login')
      return
    }

    auth.fetchUser(token)
      .then((user) => navigate(landingPathFor(user)))
      .catch(() => {
        setError('Gagal memproses login Google')
        const t = setTimeout(() => navigate('/login'), 2500)
        return () => clearTimeout(t)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {error ? (
        <>
          <p className="text-[14px] font-medium text-[#b42318]">{error}</p>
          <p className="text-[12px] text-[#686b73]">Mengalihkan ke halaman login…</p>
        </>
      ) : (
        <>
          <div className="size-8 animate-spin rounded-full border-2 border-[#dde3ff] border-t-[#03f]" />
          <p className="text-[14px] font-medium text-[#17191f]">Memproses login Google…</p>
        </>
      )}
    </div>
  )
}

// ─── Sidebar destinations that don't have a design yet ───
const PLACEHOLDER_ROUTES = [
  { path: '/learning', title: 'My Learning', description: 'Saved learning paths you can revisit and continue.' },
  { path: '/materials', title: 'Materials', description: 'Uploaded PDF, DOCX and PPTX materials and their processing status.' },
  { path: '/quizzes', title: 'Quizzes', description: 'Quizzes generated from your materials, and the results of past attempts.' },
  { path: '/communities', title: 'Communities', description: 'Study circles you belong to, their discussions and shared resources.' },
  { path: '/progress', title: 'Progress', description: 'Your learning performance over time.' },
  { path: '/achievements', title: 'Achievements', description: 'Badges and reward tokens you have earned.' },
  { path: '/leaderboard', title: 'Leaderboard', description: 'How you and your communities are doing.' },
  { path: '/settings', title: 'Settings', description: 'Account, subscription and preferences.' },
  { path: '/pro', title: 'Explore Pro', description: 'Higher AI quota, premium features and community creation.' },
]

function App() {
  const navigate = useNavigate()
  const auth = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage] = useState('')

  const handleLogin = async ({ email, password }) => {
    setIsSubmitting(true)
    setFormError('')
    setFieldErrors({})
    try {
      const { user } = await auth.login({ email, password })
      navigate(landingPathFor(user))
    } catch (err) {
      const res = err.response
      if (res?.status === 422) {
        setFieldErrors(res.data.errors || {})
        const first = Object.values(res.data.errors || {})[0]
        setFormError(Array.isArray(first) ? first[0] : first)
      } else {
        setFormError(res?.data?.message || 'Login gagal. Coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async ({ name, email, password }) => {
    setIsSubmitting(true)
    setFormError('')
    setFieldErrors({})
    try {
      const { user } = await auth.register({ name, email, password })
      navigate(landingPathFor(user))
    } catch (err) {
      const res = err.response
      if (res?.status === 422) {
        setFieldErrors(res.data.errors || {})
        const first = Object.values(res.data.errors || {})[0]
        setFormError(Array.isArray(first) ? first[0] : first)
      } else {
        setFormError(res?.data?.message || 'Registrasi gagal. Coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    auth.loginWithGoogle()
  }

  const loginForm = (
    <LoginForm
      onLogin={handleLogin}
      onGoogleSignIn={handleGoogleSignIn}
      onCreateAccount={() => navigate('/register')}
      isSubmitting={isSubmitting}
      formError={formError}
      fieldErrors={fieldErrors}
      successMessage={successMessage}
    />
  )

  const registerForm = (
    <RegisterForm
      onRegister={handleRegister}
      onGoogleSignIn={handleGoogleSignIn}
      onBackToLogin={() => navigate('/login')}
      isSubmitting={isSubmitting}
      formError={formError}
    />
  )

  return (
    <Routes>
      {/* ── Public / auth ── */}
      <Route path="/" element={<AuthLayout variant="login">{loginForm}</AuthLayout>} />
      <Route path="/login" element={<AuthLayout variant="login">{loginForm}</AuthLayout>} />
      <Route path="/register" element={<AuthLayout variant="register">{registerForm}</AuthLayout>} />
      <Route
        path="/auth/google-callback"
        element={
          <AuthLayout variant="login">
            <GoogleCallbackHandler />
          </AuthLayout>
        }
      />

      {/* ── Authenticated app ── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell title="Dashboard">
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppShell title="Profile">
              <ProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <AppShell title="Edit Profile">
              <EditProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {PLACEHOLDER_ROUTES.map(({ path, title, description }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <AppShell title={title}>
                <PlaceholderPage title={title} description={description} />
              </AppShell>
            </ProtectedRoute>
          }
        />
      ))}

      {/* ── Admin console — desktop only, admin role only ── */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <Navigate to={ADMIN_OVERVIEW_PATH} replace />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path={ADMIN_OVERVIEW_PATH}
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminOverviewPage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {ADMIN_PENDING_ITEMS.map(({ to, label }) => (
        <Route
          key={to}
          path={to}
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminUnavailablePage title={label} />
              </AdminLayout>
            </AdminRoute>
          }
        />
      ))}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
