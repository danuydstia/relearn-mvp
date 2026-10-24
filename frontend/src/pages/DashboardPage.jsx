import { useEffect, useRef, useState } from 'react'
import LearningInvitation from '../components/dashboard/LearningInvitation.jsx'
import ContinueLearning from '../components/dashboard/ContinueLearning.jsx'
import LearningPerformance from '../components/dashboard/LearningPerformance.jsx'
import RecentLearning from '../components/dashboard/RecentLearning.jsx'
import YourCommunity from '../components/dashboard/YourCommunity.jsx'
import ProgressAchievements from '../components/dashboard/ProgressAchievements.jsx'
import MaterialStatus from '../components/dashboard/MaterialStatus.jsx'
import UploadMaterialModal from '../components/materials/UploadMaterialModal.jsx'
import { ACCEPTED_MATERIAL_TYPES, listMaterials, uploadMaterial } from '../lib/materials'

/**
 * DashboardPage — "Learning home" (neo-brutalist).
 *
 * Urutan blok (satu kolom, gap 32px):
 *   1. LearningInvitation  — hero + kartu lime (CTA upload, AI usage)
 *   2. ContinueLearning    — kartu putih (808) + kartu hitam (252)
 *   3. LearningPerformance — strip 3 panel
 *   4. Grid 3 kolom (420 : 320 : 300): Recent Learning, Community, Progress
 *   5. MaterialStatus      — empty / processing / failed (kondisional)
 *   6. Catatan footer
 * Di bawah 1024px semua menumpuk; baris 4 jadi 2 kolom di tablet.
 * Gutter: 24px mobile, 32px tablet, 40px desktop.
 */
export default function DashboardPage() {
  const fileInputRef = useRef(null)
  const [materials, setMaterials] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingName, setUploadingName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

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

    setIsUploadModalOpen(false)
    setUploading(true)
    setUploadingName(file.name)
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
      setUploadingName('')
    }
  }

  return (
    <div className="flex w-full flex-col bg-[#f7f7f2] px-6 pt-7 pb-8 md:px-8 md:py-8 lg:px-10 lg:pt-9 lg:pb-7">
      <div className="flex w-full max-w-[1128px] flex-col gap-8">
        <LearningInvitation onNewSession={() => setIsUploadModalOpen(true)} />

        {uploadError && (
          <p className="text-[13px] font-bold text-[#b42318]" role="alert">
            {uploadError}
          </p>
        )}

        <ContinueLearning />

        <LearningPerformance />

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,420fr)_minmax(0,320fr)_minmax(0,300fr)]">
          <RecentLearning materials={materials} className="md:col-span-2 lg:col-span-1" />
          <YourCommunity />
          <ProgressAchievements />
        </div>

        <MaterialStatus
          materials={materials}
          uploading={uploading}
          uploadingName={uploadingName}
          onUpload={() => setIsUploadModalOpen(true)}
        />

        <p className="w-full text-[11px] font-black text-[#62665c] opacity-80">
          Example student data · For design review only
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MATERIAL_TYPES}
          className="hidden"
          onChange={handleFileSelected}
        />

        <UploadMaterialModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onChooseFile={openUploadPicker}
        />
      </div>
    </div>
  )
}