import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import ProgressTrack from '../ui/ProgressTrack.jsx'
import Panel from './Panel.jsx'
import { learningPathUrl } from '../../lib/learningPath'

/**
 * LessonOutline — A04's 264px left rail (design 129:28321).
 *
 * The two cards are separated by 16px. Everything inside each card is also a
 * 16px gap, which is how the 424px / 148px heights come out in Figma.
 */
export function LessonOutline({ path, pathSlug, currentModule }) {
  const progress = Math.round((path.completedTopics / path.totalTopics) * 100)
  const completed = path.modules.filter((module) => module.status === 'completed')
  const locked = path.modules.filter((module) => module.status === 'locked')

  return (
    <Panel data-testid="lesson-outline" className="flex w-full flex-col gap-4 p-5">
      <p className="text-[16px] leading-[1.5] font-semibold text-[#17191f]">Module outline</p>

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-start justify-between text-[12px] leading-[15px] whitespace-nowrap">
          <p className="font-normal text-[#686b73]">Path progress</p>
          <p className="font-medium text-[#17191f]">
            {path.completedTopics} of {path.totalTopics} topics
          </p>
        </div>
        <ProgressTrack value={progress} />
      </div>

      <div className="h-px w-full shrink-0 bg-[#deded9]" />

      {completed.map((module) => (
        <p key={module.slug} className="text-[12px] leading-[1.5] font-normal text-[#27644b]">
          ✓ {module.title}
        </p>
      ))}

      <span className="self-start rounded-[6px] bg-[#eef1ff] px-[10px] py-[5px] text-[11px] leading-[13px] font-medium whitespace-nowrap text-[#0033ff]">
        Module {currentModule.moduleNumber} · In progress
      </span>

      <p className="text-[13px] leading-[20px] font-semibold text-[#0033ff]">
        {path.currentTopic.title}
      </p>

      <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
        Next · {path.currentTopic.next}
      </p>

      <div className="h-px w-full shrink-0 bg-[#deded9]" />

      {locked.map((module) => (
        <Fragment key={module.slug}>
          {(module.topics ?? [module.title]).map((topic) => (
            <p key={topic} className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
              Locked · {topic}
            </p>
          ))}
        </Fragment>
      ))}

      <Link
        to={learningPathUrl(pathSlug)}
        className="self-start text-[13px] leading-[20px] font-medium whitespace-nowrap text-[#0033ff] hover:underline"
      >
        Back to learning path →
      </Link>
    </Panel>
  )
}

export function PracticePanel({ quiz }) {
  return (
    <Panel data-testid="practice-panel" className="flex w-full flex-col gap-4 p-5">
      <p className="text-[13px] leading-[20px] font-semibold text-[#17191f]">
        Practice when you’re ready
      </p>
      <p className="text-[12px] leading-[18px] font-normal text-[#686b73]">
        {quiz.title} checks SELECT, filters, joins and grouping.
      </p>
      <Link
        to="/quizzes"
        className="self-start text-[13px] leading-[20px] font-medium whitespace-nowrap text-[#0033ff] hover:underline"
      >
        Quiz details →
      </Link>
    </Panel>
  )
}
