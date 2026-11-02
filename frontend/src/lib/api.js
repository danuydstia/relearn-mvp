import axios from 'axios'

// Jika berjalan di produksi (Vercel), gunakan relative path '/api/v1'
// yang akan di-proxy secara aman oleh Vercel Rewrites tanpa masalah Mixed Content
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1')

// Memastikan base URL selalu berakhir dengan /api/v1
export const API_BASE_URL = rawBaseUrl.endsWith('/api/v1')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, '')}/api/v1`

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 300000, // 5 Menit
})
