import { useEffect, useRef, useState } from 'react'
import LearningInvitation from '../components/dashboard/LearningInvitation.jsx'
import ContinueLearning from '../components/dashboard/ContinueLearning.jsx'
import RecentLearning from '../components/dashboard/RecentLearning.jsx'
import LearningPerformance from '../components/dashboard/LearningPerformance.jsx'
import YourCommunity from '../components/dashboard/YourCommunity.jsx'
import ProgressAchievements from '../components/dashboard/ProgressAchievements.jsx'
import AccountUsage from '../components/dashboard/AccountUsage.jsx'
import { ACCEPTED_MATERIAL_TYPES, listMaterials, uploadMaterial } from '../lib/materials'

/**
 * DashboardPage — "Learning home" (design 2:7899), mobile 2:6354, tablet 2:6913.
 *
 * Desktop (≥1024px): 40px gutters, the invitation spans the width, then a left
 *   learning column (Continue + Recent) beside a 340px reflection rail
 *   (Performance, Community, Progress). The AI-usage block lives in the sidebar.
 * Tablet (768–1023px): 32px gutters, everything stacks in one 808px column, but
 *   the reflection group splits into two 392px columns — Performance beside
 *   Community-over-Progress. AI usage becomes a card in the page flow.
 * Mobile (<768px): 24px gutters, a single 342px column throughout, 30px heading,
 *   and a footer note closing the page.
 *
 * The learning-path / performance / community blocks are the design's
 * illustrative content. Material upload is wired to the API, and the designed
 * "no content" state shows when the user has no materials.
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
    <div className="flex w-full flex-col px-6 pt-7 pb-8 md:px-8 md:py-8 lg:px-10 lg:py-10">
      {/* Bounded to the design's 1128px "Content boundary" — the spec states the
          desktop content is bounded rather than stretched (60:9231). No effect
          until the viewport exceeds ~1552px. */}
      <div className="flex w-full max-w-[1128px] flex-col gap-8">
        <LearningInvitation onNewSession={openUploadPicker} />

        {uploadError && (
          <p className="text-[13px] font-medium text-[#b42318]" role="alert">
            {uploadError}
          </p>
        )}

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-7">
          {/* Learning column */}
          <div className="flex w-full min-w-0 flex-col gap-8 lg:flex-1 lg:gap-7">
            <ContinueLearning />
            <RecentLearning
              showEmptyState={hasNoMaterials}
              onUpload={openUploadPicker}
              uploading={uploading}
            />
          </div>

          {/* Reflection group — two equal columns on tablet, one 340px rail on desktop. */}
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:items-start md:gap-6 lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-7">
            <LearningPerformance />
            <div className="flex w-full flex-col gap-8 md:gap-6 lg:gap-7">
              <YourCommunity />
              <ProgressAchievements />
            </div>
          </div>
        </div>

        {/* Below 1024px the sidebar's AI-usage block and the design-review note
            move into the page flow (design 2:7093 / 2:7102). */}
        <AccountUsage className="lg:hidden" />
        <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73] lg:hidden">
          Example student data · For design review only
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MATERIAL_TYPES}
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>
    </div>
  )
}
