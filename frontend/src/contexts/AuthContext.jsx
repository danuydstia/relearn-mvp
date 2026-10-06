import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    api.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const register = async ({ name, email, password }) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: password,
    })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const login = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/redirect`
  }

  // Ambil user dari token yang diberikan (dipakai untuk Google callback)
  const fetchUser = async (authToken) => {
    const res = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    localStorage.setItem('token', authToken)
    setUser(res.data)
    setToken(authToken)
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    loginWithGoogle,
    fetchUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}