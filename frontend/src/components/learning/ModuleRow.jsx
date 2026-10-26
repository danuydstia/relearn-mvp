import { Link } from 'react-router-dom'
import { BookOpen, CircleCheck } from 'lucide-react'

const ICONS = {
  completed: CircleCheck,
  in_progress: BookOpen,
}

export default function ModuleRow({ module, pathSlug }) {
  const Icon = ICONS[module.status] ?? BookOpen

  const meta = `${module.status === 'completed' ? 'Completed' : 'In progress'} · ${
    module.completedTopics
  } of ${module.totalTopics} topics`

  // Cari topik pertama yang belum selesai
  const firstUncompletedTopic = module.topics.find(t => !t.is_completed) || module.topics[0]

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

      {firstUncompletedTopic && (
        <Link
          to={`/materials/${pathSlug}/topics/${firstUncompletedTopic.id}`}
          className="self-start text-[13px] leading-[1.5] font-black text-[#405c04] hover:underline"
        >
          Open module →
        </Link>
      )}
    </div>
  )
}