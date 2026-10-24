import { Link, Navigate, useParams } from 'react-router-dom'
import { ClipboardCheck } from 'lucide-react'
import ModuleRow from '../components/learning/ModuleRow.jsx'
import Panel from '../components/learning/Panel.jsx'
import ProgressRing from '../components/learning/ProgressRing.jsx'
import Button from '../components/ui/Button.jsx'
import ProgressTrack from '../components/ui/ProgressTrack.jsx'
import TextAction from '../components/ui/TextAction.jsx'
import {
  learningPath,
  learningPathUrl,
  moduleUrl,
} from '../lib/learningPath'

/**
 * LearningPathPage — A03 "Introduction to Database Systems".
 *
 * Desktop: kolom urutan modul (fleksibel) + 28px gap + rail progress 352px di
 * dalam batas konten 1128px. Kedua kolom menumpuk di bawah breakpoint `xl`
 * supaya baris modul tetap nyaman dibaca di 1024–1279px.
 */
export default function LearningPathPage() {
  const { pathSlug } = useParams()

  if (pathSlug !== learningPath.slug) {
    return <Navigate to={learningPathUrl()} replace />
  }

  const progress = Math.round((learningPath.completedTopics / learningPath.totalTopics) * 100)
  const continueUrl = moduleUrl(learningPath.currentTopic.moduleSlug, pathSlug)

  return (
    <div data-testid="learning-path-page" className="flex w-full flex-col px-6 pt-7 pb-8 md:px-8 md:py-8 lg:p-10">
      <div data-testid="learning-content" className="mx-auto flex w-full max-w-[1128px] flex-col gap-7">
        <header className="flex w-full flex-col gap-2">
          <h1 className="text-[28px] leading-[1.5] font-black text-[#171916] md:text-[32px]">
            {learningPath.title}
          </h1>
          <p className="text-[14px] leading-[1.5] font-medium text-[#62665c]">
            {learningPath.totalTopics} topics · {learningPath.modules.length} modules · Source:{' '}
            {learningPath.sourceFile}
          </p>
        </header>

        <div data-testid="path-columns" className="flex w-full flex-col items-start gap-7 xl:flex-row">
          <div className="flex w-full min-w-px flex-col gap-4 xl:flex-1">
            <Panel data-testid="learning-path-modules" className="flex w-full flex-col gap-4 p-6">
              <div className="flex w-full items-center justify-between gap-3">
                <h2 className="text-[20px] leading-[1.5] font-black text-[#171916]">
                  Your learning path
                </h2>
                <span className="shrink-0 rounded-[6px] border border-solid border-[#171916] bg-[#d5f35b] px-[10px] py-[5px] text-[11px] leading-[normal] font-black whitespace-nowrap text-[#171916]">
                  {learningPath.modules.length} modules
                </span>
              </div>

              <div className="flex w-full flex-col gap-4">
                {learningPath.modules.map((module) => (
                  <ModuleRow key={module.slug} module={module} pathSlug={pathSlug} />
                ))}
              </div>
            </Panel>

            <p className="text-[11px] leading-[1.5] font-medium text-[#62665c]">
              Modules are ordered by your course material. Finish a module to open the next.
            </p>
          </div>

          <div data-testid="learning-path-rail" className="flex w-full flex-col gap-5 xl:w-[352px] xl:shrink-0">
            <Panel data-testid="path-progress-card" className="flex w-full flex-col p-6">
              <div className="flex w-full items-center gap-4">
                <div className="flex w-[100px] shrink-0 flex-col items-center gap-3">
                  <ProgressRing value={progress} />
                  <p className="w-full text-center text-[11px] leading-[1.5] font-medium text-[#62665c]">
                    Topics complete
                  </p>
                </div>
                <div className="flex min-w-px flex-1 flex-col gap-2">
                  <p className="text-[20px] leading-[1.5] font-black text-[#171916]">
                    {learningPath.completedTopics} of {learningPath.totalTopics}
                  </p>
                  <p className="text-[12px] leading-[1.5] font-medium text-[#62665c]">
                    Your next topic is ready. Keep your momentum.
                  </p>
                </div>
              </div>
            </Panel>

            <Panel data-testid="continue-card" className="flex w-full flex-col gap-4 p-6">
              <p className="text-[22px] leading-[1.5] font-black text-[#171916]">
                Continue your last lesson
              </p>

              <div className="flex w-full flex-col gap-1">
                <p className="text-[11px] leading-[1.5] font-bold text-[#62665c]">CURRENT TOPIC</p>
                <p className="text-[14px] leading-[1.5] font-black text-[#171916]">
                  {learningPath.currentTopic.title}
                </p>
                <p className="text-[12px] leading-[1.5] font-medium text-[#62665c]">
                  Next · {learningPath.currentTopic.next}
                </p>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-start justify-between text-[12px] leading-[15px] whitespace-nowrap">
                  <p className="font-medium text-[#62665c]">Path progress</p>
                  <p className="font-black text-[#171916]">
                    {learningPath.completedTopics} of {learningPath.totalTopics} topics
                  </p>
                </div>
                <ProgressTrack value={progress} />
              </div>

              <Button as={Link} to={continueUrl} className="w-full">
                Continue →
              </Button>
            </Panel>

            <Panel data-testid="quiz-card" className="flex w-full flex-col gap-4 p-6">
              <div className="flex items-center gap-2">
                <ClipboardCheck
                  size={20}
                  strokeWidth={1.75}
                  className="shrink-0 text-[#171916]"
                  aria-hidden="true"
                />
                <p className="text-[11px] leading-[normal] font-black whitespace-nowrap text-[#62665c]">
                  Quiz
                </p>
              </div>

              <p className="text-[14px] leading-[1.5] font-black text-[#171916]">
                {learningPath.quiz.title}
              </p>

              <p className="text-[11px] leading-[1.5] font-medium text-[#62665c]">
                {learningPath.quiz.questions} questions · About {learningPath.quiz.minutes} minutes
              </p>

              <TextAction as={Link} to="/quizzes">
                Open quiz details →
              </TextAction>
            </Panel>
          </div>
        </div>

        <p className="text-[11px] leading-[1.5] font-medium text-[#62665c]">
          Example student data · For design review only
        </p>
      </div>
    </div>
  )
}