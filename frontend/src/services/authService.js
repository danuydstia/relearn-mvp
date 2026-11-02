import api from '../api'

export const login = async (credentials) => {
  return await api.post('/api/v1/auth/login', credentials)
}

export const register = async (userData) => {
  return await api.post('/api/v1/auth/register', userData)
}

export default {
  login,
  register,
}

