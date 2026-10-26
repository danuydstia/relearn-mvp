import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 300000, // 5 Menit (300.000 ms) - Biarkan 0 jika ingin tanpa batas
})