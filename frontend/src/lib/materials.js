import { api } from './api'

/** List the authenticated user's materials. */
export async function listMaterials() {
  const res = await api.get('/materials')
  return res.data.data
}

/**
 * Upload a material file (PDF / DOCX / PPTX).
 * @param {File} file
 * @param {(percent:number)=>void} [onProgress]
 */
export async function uploadMaterial(file, onProgress) {
  const form = new FormData()
  form.append('file', file)

  const res = await api.post('/materials', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) return
      onProgress(Math.round((event.loaded / event.total) * 100))
    },
  })

  return res.data.data
}

/** Delete a material. */
export async function deleteMaterial(id) {
  await api.delete(`/materials/${id}`)
}

export const ACCEPTED_MATERIAL_TYPES = '.pdf,.docx,.pptx'
