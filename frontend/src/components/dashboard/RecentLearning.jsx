import {
  BookOpen,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  FileText,
  LoaderCircle,
} from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'
import UploadMaterialEmptyState from '../materials/UploadMaterialEmptyState.jsx'

/**
 * RecentLearning — design nodes 2:8022 (heading), 2:8025 (cards),
 * 2:8053 (processing state), 2:8074 (error state), 91:4710 (empty state);
 * mobile 2:6414.
 *
 * The three recent cards sit in a row from 768px up and stack below that. The
 * processing steps and the error card's Retry button do the same, and the
 * section's vertical rhythm tightens from 16px to 12px on mobile.
 *
 * The learning-path and quiz cards are illustrative. The material card and the
 * processing/error states are driven by the user's real materials: the preview
 * states only render while an upload is in flight, a material is still being
 * processed, or one failed. They are never shown as permanent decoration.
 */
const PATH_CARD = {
  id: 'path',
  icon: BookOpen,
  type: 'Learning path',
  title: 'Cellular Respiration',
  meta: 'Learning path · Ready',
  action: 'Open path →',
}

const MATERIAL_PLACEHOLDER_CARD = {
  id: 'material',
  icon: FileText,
  type: 'Material',
  title: 'Cell Biology — Lecture 02',
  meta: 'PPTX · Ready to learn',
  action: 'Open material →',
}

const QUIZ_CARD = {
  id: 'quiz',
  icon: ClipboardCheck,
  type: 'Quiz',
  title: 'SQL Fundamentals',
  meta: 'Latest score · 80%',
  action: 'Review quiz →',
}

/** One row of the processing tracker — stacks on mobile, spreads out from 768px. */
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

const MATERIAL_STATUS_LABEL = {
  pending: 'Processing',
  processing: 'Processing',
  completed: 'Ready to learn',
  failed: 'Upload failed',
}

function materialFileName(material) {
  return material.file_type ? `${material.title}.${material.file_type}` : material.title
}

function ProcessingStep({ state }) {
  if (state === 'done') {
    return (
      <CircleCheck size={14} strokeWidth={2} className="shrink-0 text-[#17191f]" aria-hidden="true" />
    )
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
  return <span className="size-[14px] shrink-0 rounded-full border border-[#686b73]" aria-hidden="true" />
}

const STEP_TEXT = {
  done: 'text-[#17191f] font-normal',
  active: 'text-[#0033ff] font-medium',
  pending: 'text-[#686b73] font-normal',
}

function ProcessingCard({ fileName, steps }) {
  return (
    <Card className="flex w-full flex-col gap-3 p-5">
      <div className="flex w-full items-start gap-3">
        <LoaderCircle
          size={20}
          strokeWidth={1.75}
          className="shrink-0 animate-spin text-[#0033ff]"
          aria-hidden="true"
        />
        <div className="flex min-w-px flex-1 flex-col gap-1 leading-[1.5]">
          <p className="text-[13px] font-semibold text-[#17191f]">Processing your material...</p>
          <p className="truncate text-[11px] font-normal text-[#686b73]">{fileName}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[10px] md:flex-row md:items-start md:gap-4">
        {steps.map(({ id, label, state }) => (
          <div key={id} className="flex min-w-px flex-1 items-center gap-1.5">
            <ProcessingStep state={state} />
            <p className={`min-w-px flex-1 text-[10px] leading-[1.5] ${STEP_TEXT[state]}`}>{label}</p>
          </div>
        ))}
      </div>

      <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">
        You don’t need to stay on this page while your material is processing.
      </p>
    </Card>
  )
}

function FailedCard({ fileName, onRetry }) {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[12px] border border-solid border-[#dad9d4] bg-[#fff5f2] p-5 md:flex-row">
      <div className="flex w-full items-start gap-3 md:min-w-px md:flex-1">
        <CircleAlert size={20} strokeWidth={1.75} className="shrink-0 text-[#b42318]" aria-hidden="true" />
        <div className="flex min-w-px flex-1 flex-col gap-[5px] leading-[1.5]">
          <p className="text-[13px] font-medium text-[#17191f]">
            Something went wrong while processing this material.
          </p>
          <p className="truncate text-[11px] font-normal text-[#686b73]">{fileName}</p>
        </div>
      </div>
      <Button variant="secondary" className="shrink-0" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

export default function RecentLearning({
  materials = null,
  uploading = false,
  uploadingName = '',
  onUpload,
}) {
  const list = Array.isArray(materials) ? materials : []
  const latestMaterial = list[0] ?? null
  const processingMaterial = list.find(
    (material) => material.status === 'pending' || material.status === 'processing',
  )
  const failedMaterial = list.find((material) => material.status === 'failed')

  // Only an empty *loaded* list shows the empty state; `null` means the list is
  // still loading or failed, so we render the illustrative cards without
  // pretending a material is processing.
  const showEmptyState = Array.isArray(materials) && list.length === 0 && !uploading

  const materialCard = latestMaterial
    ? {
        id: `material-${latestMaterial.id}`,
        icon: FileText,
        type: 'Material',
        title: latestMaterial.title,
        meta: `${(latestMaterial.file_type || 'file').toUpperCase()} · ${MATERIAL_STATUS_LABEL[latestMaterial.status] ?? 'Ready to learn'}`,
        action: 'Open material →',
      }
    : MATERIAL_PLACEHOLDER_CARD

  return (
    <section className="flex w-full flex-col gap-3 md:gap-4">
      <SectionHeading title="Recent Learning" />

      <div className="flex w-full flex-col gap-3 md:flex-row md:items-start">
        {[PATH_CARD, materialCard, QUIZ_CARD].map(({ id, icon: Icon, type, title, meta, action }) => (
          <Card key={id} className="flex w-full flex-col gap-4 p-6 md:min-w-px md:flex-1">
            <div className="flex shrink-0 items-center gap-2">
              <Icon size={20} strokeWidth={1.75} className="shrink-0 text-[#0033ff]" aria-hidden="true" />
              <p className="text-[11px] leading-[normal] font-medium whitespace-nowrap text-[#686b73]">
                {type}
              </p>
            </div>
            <p className="text-[14px] leading-[1.5] font-semibold text-[#17191f]">{title}</p>
            <p className="text-[11px] leading-[1.5] font-normal text-[#686b73]">{meta}</p>
            <TextAction>{action}</TextAction>
          </Card>
        ))}
      </div>

      {showEmptyState && <UploadMaterialEmptyState onUpload={onUpload} uploading={uploading} />}

      {(uploading || processingMaterial) && (
        <ProcessingCard
          fileName={
            uploading
              ? uploadingName || 'Your material'
              : materialFileName(processingMaterial)
          }
          steps={uploading ? UPLOADING_STEPS : PROCESSING_STEPS}
        />
      )}

      {failedMaterial && (
        <FailedCard fileName={materialFileName(failedMaterial)} onRetry={onUpload} />
      )}
    </section>
  )
}
