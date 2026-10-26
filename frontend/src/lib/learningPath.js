import { api } from './api' // Sesuaikan path-nya

/**
 * Mengambil data Learning Path dari Laravel
 * @param {number|string} materialId 
 */
export async function getLearningPath(materialId) {
  const response = await api.get(`/materials/${materialId}/learning-path`)
  return response.data
}

export async function saveQuizAttempt(materialId, payload) {
  const response = await api.post(`/materials/${materialId}/quiz/attempt`, payload)
  return response.data
}

/**
 * Menandai topik selesai
 * @param {number|string} materialId 
 * @param {number|string} topicId 
 */
export async function markTopicComplete(materialId, topicId) {
  const response = await api.post(`/materials/${materialId}/topics/${topicId}/complete`)
  return response.data
}