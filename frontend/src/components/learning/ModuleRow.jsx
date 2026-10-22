import { Link } from 'react-router-dom'
import { BookOpen, CircleCheck, LockKeyhole } from 'lucide-react'
import { moduleUrl } from '../../lib/learningPath'

/**
 * ModuleRow — A03's ordered-module row (129:28058 and siblings).
 *
 * Completed and locked rows are 100px tall; the in-progress row adds the
 * "Open module →" action and grows to 128px. The 8px internal gap and 16px
 * padding are what produce those heights, so keep them in sync with the design.
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
      className="flex w-full flex-col gap-2 rounded-[12px] bg-white -outline-offset-1 outline outline-1 outline-solid outline-[#deded9] p-4"
    >
      <div className="flex w-full items-center gap-4">
        <Icon
          size={20}
          strokeWidth={1.75}
          className={`shrink-0 ${isLocked ? 'text-[#17191f]' : 'text-[#0033ff]'}`}
          aria-hidden="true"
        />
        <div className="flex min-w-px flex-1 flex-col gap-0.5">
          <p className="text-[15px] leading-[23px] font-semibold text-[#17191f]">{module.title}</p>
          <p className="text-[11px] leading-[17px] font-normal text-[#686b73]">{meta}</p>
        </div>
      </div>

      <p className="text-[12px] leading-[18px] font-normal text-[#686b73]">{module.summary}</p>

      {isInProgress && (
        <Link
          to={moduleUrl(module.slug, pathSlug)}
          className="self-start text-[13px] leading-[20px] font-medium text-[#0033ff] hover:underline"
        >
          Open module →
        </Link>
      )}
    </div>
  )
}
