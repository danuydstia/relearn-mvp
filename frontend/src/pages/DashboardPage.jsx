import { useEffect, useRef, useState } from 'react'
import LearningInvitation from '../components/dashboard/LearningInvitation.jsx'
import ContinueLearning from '../components/dashboard/ContinueLearning.jsx'
import RecentLearning from '../components/dashboard/RecentLearning.jsx'
import LearningPerformance from '../components/dashboard/LearningPerformance.jsx'
import YourCommunity from '../components/dashboard/YourCommunity.jsx'
import ProgressAchievements from '../components/dashboard/ProgressAchievements.jsx'
import { ACCEPTED_MATERIAL_TYPES, listMaterials, uploadMaterial } from '../lib/materials'

/**
 * DashboardPage — "Learning home" (design node 2:7899).
 * Left column: Continue Learning + Recent Learning.
 * Right column: Learning Performance, Your Community, progress highlights.
 *
 * Batch 1: the learning-path / performance / community blocks are the
 * design's illustrative content. Material upload is wired to the API, and
 * the designed "no content" state shows when the user has no materials.
 */
export default function DashboardPage() {
  const fileInputRef = useRef(null)
  const [materials, setMaterials] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    let alive = true
    listMaterials()
      .then((data) => alive && setMaterials(data))
      .catch(() => alive && setMaterials(null))
    return () => {
      alive = false
    }
  }, [])

  const openUploadPicker = () => fileInputRef.current?.click()

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setUploadError('')
    try {
      const material = await uploadMaterial(file)
      setMaterials((current) => [material, ...(current ?? [])])
    } catch (err) {
      const res = err.response
      const first = res?.data?.errors?.file?.[0]
      setUploadError(first || res?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const hasNoMaterials = Array.isArray(materials) && materials.length === 0

  return (
    <div className="flex w-full flex-col gap-8 px-10 pt-10 pb-10">
      <LearningInvitation onNewSession={openUploadPicker} />

      {uploadError && (
        <p className="text-[13px] font-medium text-[#b42318]" role="alert">
          {uploadError}
        </p>
      )}

      <div className="flex w-full items-start gap-7">
        <div className="flex min-w-0 flex-1 flex-col gap-7">
          <ContinueLearning />
          <RecentLearning
            showEmptyState={hasNoMaterials}
            onUpload={openUploadPicker}
            uploading={uploading}
          />
        </div>

        <div className="flex w-[340px] shrink-0 flex-col gap-7">
          <LearningPerformance />
          <YourCommunity />
          <ProgressAchievements />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_MATERIAL_TYPES}
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  )
}
