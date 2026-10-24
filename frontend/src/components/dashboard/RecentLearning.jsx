import { BookOpen, ClipboardCheck, FileText } from 'lucide-react'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'

/**
 * RecentLearning — satu kartu berisi 3 baris (path, material, quiz) dengan
 * pemisah 1px. Baris path dan quiz ilustratif; baris material mengikuti
 * material terbaru user. State empty/processing/failed ada di MaterialStatus.
 */
const PATH_ROW = {
  id: 'path',
  icon: BookOpen,
  type: 'Learning path',
  title: 'Cellular Respiration',
  meta: 'Learning path · Ready',
  action: 'Open path →',
}

const MATERIAL_PLACEHOLDER_ROW = {
  id: 'material',
  icon: FileText,
  type: 'Material',
  title: 'Cell Biology — Lecture 02',
  meta: 'PPTX · Ready to learn',
  action: 'Open material →',
}

const QUIZ_ROW = {
  id: 'quiz',
  icon: ClipboardCheck,
  type: 'Quiz',
  title: 'SQL Fundamentals',
  meta: 'Latest score · 80%',
  action: 'Review quiz →',
}

const MATERIAL_STATUS_LABEL = {
  pending: 'Processing',
  processing: 'Processing',
  completed: 'Ready to learn',
  failed: 'Upload failed',
}

export default function RecentLearning({ materials = null, className = '' }) {
  const list = Array.isArray(materials) ? materials : []
  const latestMaterial = list[0] ?? null

  const materialRow = latestMaterial
    ? {
        id: `material-${latestMaterial.id}`,
        icon: FileText,
        type: 'Material',
        title: latestMaterial.title,
        meta: `${(latestMaterial.file_type || 'file').toUpperCase()} · ${MATERIAL_STATUS_LABEL[latestMaterial.status] ?? 'Ready to learn'}`,
        action: 'Open material →',
      }
    : MATERIAL_PLACEHOLDER_ROW

  return (
    <section className={`flex w-full min-w-0 flex-col gap-[18px] ${className}`}>
      <SectionHeading title="Recent Learning" className="lg:h-[58px] lg:items-end" />

      <Card className="flex min-h-[344px] w-full flex-1 flex-col overflow-hidden">
        {[PATH_ROW, materialRow, QUIZ_ROW].map(({ id, icon: Icon, type, title, meta, action }, index) => (
          <div
            key={id}
            className={`flex w-full flex-1 items-center gap-[14px] px-5 py-[27px] ${
              index > 0 ? 'border-t border-solid border-[#171916]' : ''
            }`}
          >
            <Icon size={22} strokeWidth={1.7} className="shrink-0 text-[#171916]" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
              <p className="text-[10px] leading-[1.4] font-black text-[#62665c]">{type}</p>
              <p className="truncate text-[15px] leading-[1.25] font-bold text-[#171916]">{title}</p>
              <p className="text-[11px] leading-[1.5] font-normal text-[#62665c]">{meta}</p>
            </div>
            <TextAction className="shrink-0">{action}</TextAction>
          </div>
        ))}
      </Card>
    </section>
  )
}