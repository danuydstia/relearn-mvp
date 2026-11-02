import axios from 'axios'

// Jika frontend dan backend di bawah domain yang sama (VPS), gunakan relative path '/api/v1'
// Fallback ke import.meta.env.VITE_API_URL atau domain backend HTTPS
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api/v1`
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'relearn-api.duckdns.org') {
    return '/api/v1'
  }
  return 'https://relearn-api.duckdns.org/api/v1'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 300000,
})

// Request interceptor untuk menyisipkan Bearer Token dan mencegah duplikasi rute
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Hindari duplikasi jika baseURL sudah memiliki /api/v1 dan url juga memuat /api/v1
    if (config.baseURL?.endsWith('/api/v1') && config.url?.startsWith('/api/v1')) {
      config.url = config.url.replace(/^\/api\/v1/, '')
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api
export { api }

