import { Link } from 'react-router-dom'
import { BookOpen, CircleCheck, LockKeyhole } from 'lucide-react'
import { moduleUrl } from '../../lib/learningPath'

/**
 * ModuleRow — baris modul berurutan di A03.
 *
 * Baris selesai dan terkunci tampil sama (outline 2px ink, radius 8, p-16);
 * baris in-progress menambah aksi "Open module →". Gap internal 8px dan
 * padding 16px menghasilkan tinggi baris seperti di Figma.
 */
const ICONS = {
  completed: CircleCheck,
  in_progress: BookOpen,
  locked: LockKeyhole,
}

export default function ModuleRow({ module, pathSlug }) {
  const Icon = ICONS[module.status] ?? BookOpen
  const isLocked = module.status === 'locked'
  const isInProgress = module.status === 'in_progress'

  const meta = isLocked
    ? `Locked · ${module.lockedReason ?? 'Complete the previous module first'}`
    : `${module.status === 'completed' ? 'Completed' : 'In progress'} · ${
        module.completedTopics
      } of ${module.totalTopics} topics`

  return (
    <div
      data-testid="module-row"
      data-status={module.status}
      className="flex w-full flex-col gap-2 rounded-[8px] bg-white p-4 -outline-offset-2 outline outline-2 outline-solid outline-[#171916]"
    >
      <div className="flex w-full items-center gap-4">
        <Icon size={20} strokeWidth={1.75} className="shrink-0 text-[#171916]" aria-hidden="true" />
        <div className="flex min-w-px flex-1 flex-col gap-0.5">
          <p className="text-[15px] leading-[1.5] font-black text-[#171916]">{module.title}</p>
          <p className="text-[11px] leading-[1.5] font-medium text-[#62665c]">{meta}</p>
        </div>
      </div>

      <p className="text-[12px] leading-[1.5] font-medium text-[#62665c]">{module.summary}</p>

      {isInProgress && (
        <Link
          to={moduleUrl(module.slug, pathSlug)}
          className="self-start text-[13px] leading-[1.5] font-black text-[#405c04] hover:underline"
        >
          Open module →
        </Link>
      )}
    </div>
  )
}