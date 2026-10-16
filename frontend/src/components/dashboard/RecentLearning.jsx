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
 * 2:8053 (processing state), 2:8074 (error state), 91:4710 (empty state).
 *
 * The three recent cards are illustrative until learning paths, materials
 * and quizzes are wired to the API. The footer switches to the designed
 * "no content" state when the user has no materials yet.
 */
const RECENT_ITEMS = [
  {
    id: 'path',
    icon: BookOpen,
    type: 'Learning path',
    title: 'Cellular Respiration',
    meta: 'Learning path · Ready',
    action: 'Open path →',
  },
  {
    id: 'material',
    icon: FileText,
    type: 'Material',
    title: 'Cell Biology — Lecture 02',
    meta: 'PPTX · Ready to learn',
    action: 'Open material →',
  },
  {
    id: 'quiz',
    icon: ClipboardCheck,
    type: 'Quiz',
    title: 'SQL Fundamentals',
    meta: 'Latest score · 80%',
    action: 'Review quiz →',
  },
]

export default function RecentLearning({ showEmptyState = false, onUpload, uploading = false }) {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Recent Learning" />

      <div className="flex w-full items-start gap-3">
        {RECENT_ITEMS.map(({ id, icon: Icon, type, title, meta, action }) => (
          <Card key={id} className="flex min-w-px flex-1 flex-col gap-4 p-6">
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

      {showEmptyState ? (
        <UploadMaterialEmptyState onUpload={onUpload} uploading={uploading} />
      ) : (
        <>
          {/* Material processing state */}
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
                <p className="text-[11px] font-normal text-[#686b73]">Statistics — Week 03.pdf</p>
              </div>
            </div>

            <div className="flex w-full items-start gap-4">
              <div className="flex min-w-px flex-1 items-center gap-1.5">
                <CircleCheck size={14} strokeWidth={2} className="shrink-0 text-[#17191f]" aria-hidden="true" />
                <p className="min-w-px flex-1 text-[10px] leading-[1.5] font-normal text-[#17191f]">Uploading</p>
              </div>
              <div className="flex min-w-px flex-1 items-center gap-1.5">
                <LoaderCircle
                  size={14}
                  strokeWidth={2}
                  className="shrink-0 animate-spin text-[#0033ff]"
                  aria-hidden="true"
                />
                <p className="min-w-px flex-1 text-[10px] leading-[1.5] font-medium text-[#0033ff]">Extracting</p>
              </div>
              <div className="flex min-w-px flex-1 items-center gap-1.5">
                <span className="size-[14px] shrink-0 rounded-full border border-[#686b73]" aria-hidden="true" />
                <p className="min-w-px flex-1 text-[10px] leading-[1.5] font-normal text-[#686b73]">
                  Generating learning path
                </p>
              </div>
            </div>

            <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">
              You don’t need to stay on this page while your material is processing.
            </p>
          </Card>

          {/* Error state */}
          <div className="flex w-full flex-col items-start rounded-[12px] border border-solid border-[#dad9d4] bg-[#fff5f2] p-5">
            <div className="flex w-full items-start gap-3">
              <CircleAlert size={20} strokeWidth={1.75} className="shrink-0 text-[#b42318]" aria-hidden="true" />
              <div className="flex min-w-px flex-1 flex-col gap-[5px] leading-[1.5]">
                <p className="text-[13px] font-medium text-[#17191f]">
                  Something went wrong while processing this material.
                </p>
                <p className="text-[11px] font-normal text-[#686b73]">Research Methods.docx</p>
              </div>
              <Button variant="secondary" className="shrink-0">
                Retry
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
