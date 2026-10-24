import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import UploadMaterialEmptyState from '../materials/UploadMaterialEmptyState.jsx'

/**
 * MaterialStatus — empty / processing / failed, dipisah dari RecentLearning.
 * Hanya tampil kalau relevan: upload berjalan, ada material diproses, ada yang
 * gagal, atau daftar material kosong. Kalau processing dan failed muncul
 * bersamaan, desktop memakai dua kolom (808 : 252); selain itu satu kolom penuh.
 */
const PROCESSING_STEPS = [
  { id: 'uploading', label: 'Uploading', state: 'done' },
  { id: 'extracting', label: 'Extracting', state: 'active' },
  { id: 'generating', label: 'Generating learning path', state: 'pending' },
]

const UPLOADING_STEPS = [
  { id: 'uploading', label: 'Uploading', state: 'active' },
  { id: 'extracting', label: 'Extracting', state: 'pending' },
  { id: 'generating', label: 'Generating learning path', state: 'pending' },
]

function materialFileName(material) {
  return material.file_type ? `${material.title}.${material.file_type}` : material.title
}

function StepIcon({ state }) {
  if (state === 'done') {
    return <CircleCheck size={14} strokeWidth={2} className="shrink-0 text-[#405c04]" aria-hidden="true" />
  }
  if (state === 'active') {
    return (
      <LoaderCircle
        size={14}
        strokeWidth={2}
        className="shrink-0 animate-spin text-[#0033ff]"
        aria-hidden="true"
      />
    )
  }
  return <span className="size-[14px] shrink-0 rounded-full border-[1.7px] border-[#62665c]" aria-hidden="true" />
}

const STEP_TEXT = {
  done: 'text-[#405c04]',
  active: 'text-[#0033ff]',
  pending: 'text-[#62665c]',
}

function ProcessingCard({ fileName, steps }) {
  return (
    <Card className="flex w-full flex-col gap-[18px] p-6">
      <div className="flex w-full items-center gap-3.5">
        <LoaderCircle
          size={24}
          strokeWidth={1.7}
          className="shrink-0 animate-spin text-[#0033ff]"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[15px] font-extrabold text-[#171916]">Processing your material...</p>
          <p className="truncate text-[11px] leading-[1.5] font-normal text-[#62665c]">{fileName}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5 md:flex-row md:items-start md:gap-5">
        {steps.map(({ id, label, state }) => (
          <div key={id} className="flex min-w-0 flex-1 items-center gap-[7px]">
            <StepIcon state={state} />
            <p className={`min-w-0 flex-1 text-[10px] font-black ${STEP_TEXT[state]}`}>{label}</p>
          </div>
        ))}
      </div>

      <p className="text-[11px] leading-[1.5] font-normal text-[#62665c]">
        You don’t need to stay on this page while your material is processing.
      </p>
    </Card>
  )
}

function FailedCard({ fileName, onRetry }) {
  return (
    <Card className="flex w-full flex-col gap-3.5 p-6">
      <div className="flex w-full items-start gap-3">
        <CircleAlert size={22} strokeWidth={1.7} className="shrink-0 text-[#ff5a5a]" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="text-[14px] leading-[1.4] font-bold text-[#171916]">
            Something went wrong while processing this material.
          </p>
          <p className="truncate text-[11px] leading-[1.5] font-normal text-[#62665c]">{fileName}</p>
        </div>
      </div>
      <Button variant="secondary" className="self-start" onClick={onRetry}>
        Retry
      </Button>
    </Card>
  )
}

export default function MaterialStatus({
  materials = null,
  uploading = false,
  uploadingName = '',
  onUpload,
}) {
  const list = Array.isArray(materials) ? materials : []
  const processingMaterial = list.find(
    (material) => material.status === 'pending' || material.status === 'processing',
  )
  const failedMaterial = list.find((material) => material.status === 'failed')

  // Hanya daftar yang sudah dimuat dan kosong yang menampilkan empty state;
  // `null` berarti masih loading atau gagal dimuat.
  const showEmptyState = Array.isArray(materials) && list.length === 0 && !uploading
  const showProcessing = uploading || Boolean(processingMaterial)
  const showFailed = Boolean(failedMaterial)

  if (!showEmptyState && !showProcessing && !showFailed) return null

  const both = showProcessing && showFailed

  return (
    <div className="flex w-full flex-col gap-5">
      {showEmptyState && <UploadMaterialEmptyState onUpload={onUpload} uploading={uploading} />}

      {(showProcessing || showFailed) && (
        <div
          className={`grid w-full grid-cols-1 gap-5 ${
            both ? 'lg:grid-cols-[minmax(0,808fr)_minmax(0,252fr)]' : ''
          }`}
        >
          {showProcessing && (
            <ProcessingCard
              fileName={
                uploading ? uploadingName || 'Your material' : materialFileName(processingMaterial)
              }
              steps={uploading ? UPLOADING_STEPS : PROCESSING_STEPS}
            />
          )}
          {showFailed && (
            <FailedCard fileName={materialFileName(failedMaterial)} onRetry={onUpload} />
          )}
        </div>
      )}
    </div>
  )
}