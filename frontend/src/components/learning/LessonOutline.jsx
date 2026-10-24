import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import ProgressTrack from '../ui/ProgressTrack.jsx'
import Panel from './Panel.jsx'
import { learningPathUrl } from '../../lib/learningPath'

/**
 * LessonOutline — rail kiri 264px A04.
 * Dua kartu dipisah 16px; isi tiap kartu juga gap 16px, yang menghasilkan
 * tinggi 424px / 148px seperti di Figma.
 * Garis pemisah: ink dengan opacity 12%.
 */
export function LessonOutline({ path, pathSlug, currentModule }) {
  const progress = Math.round((path.completedTopics / path.totalTopics) * 100)
  const completed = path.modules.filter((module) => module.status === 'completed')
  const locked = path.modules.filter((module) => module.status === 'locked')

  return (
    <Panel data-testid="lesson-outline" className="flex w-full flex-col gap-4 p-5">
      <p className="text-[16px] leading-[1.5] font-black text-[#171916]">Module outline</p>

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-start justify-between text-[12px] leading-[15px] whitespace-nowrap">
          <p className="font-medium text-[#62665c]">Path progress</p>
          <p className="font-black text-[#171916]">
            {path.completedTopics} of {path.totalTopics} topics
          </p>
        </div>
        <ProgressTrack value={progress} />
      </div>

      <div className="h-px w-full shrink-0 bg-[#171916] opacity-[0.12]" />

      {completed.map((module) => (
        <p key={module.slug} className="text-[12px] leading-[1.5] font-black text-[#405c04]">
          ✓ {module.title}
        </p>
      ))}

      <span className="self-start rounded-[8px] border-2 border-solid border-[#171916] bg-[#d5f35b] px-[10px] py-[5px] text-[11px] leading-[normal] font-black whitespace-nowrap text-[#171916]">
        Module {currentModule.moduleNumber} · In progress
      </span>

      <p className="text-[13px] leading-[1.5] font-black text-[#171916]">
        {path.currentTopic.title}
      </p>

      <p className="text-[12px] leading-[1.5] font-medium text-[#62665c]">
        Next · {path.currentTopic.next}
      </p>

      <div className="h-px w-full shrink-0 bg-[#171916] opacity-[0.12]" />

      {locked.map((module) => (
        <Fragment key={module.slug}>
          {(module.topics ?? [module.title]).map((topic) => (
            <p key={topic} className="text-[12px] leading-[1.5] font-medium text-[#62665c]">
              Locked · {topic}
            </p>
          ))}
        </Fragment>
      ))}

      <Link
        to={learningPathUrl(pathSlug)}
        className="self-start text-[13px] leading-[1.5] font-black whitespace-nowrap text-[#405c04] hover:underline"
      >
        Back to learning path →
      </Link>
    </Panel>
  )
}

export function PracticePanel({ quiz }) {
  return (
    <Panel data-testid="practice-panel" className="flex w-full flex-col gap-4 p-5">
      <p className="text-[13px] leading-[1.5] font-black text-[#171916]">
        Practice when you’re ready
      </p>
      <p className="text-[12px] leading-[1.5] font-medium text-[#62665c]">
        {quiz.title} checks SELECT, filters, joins and grouping.
      </p>
      <Link
        to="/quizzes"
        className="self-start text-[13px] leading-[1.5] font-black whitespace-nowrap text-[#405c04] hover:underline"
      >
        Quiz details →
      </Link>
    </Panel>
  )
}