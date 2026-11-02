import api from '../api'

export { api }
export default api

export const API_BASE_URL = api.defaults.baseURL || '/api/v1'
