import { Fragment } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LessonOutline, PracticePanel } from '../components/learning/LessonOutline.jsx'
import Panel from '../components/learning/Panel.jsx'
import {
  learningPath,
  learningPathUrl,
  relationalDesignLesson,
} from '../lib/learningPath'

/**
 * ModuleLessonPage — A04 "Relational Database Design" (129:28250).
 *
 * Only the current topic has designed content. The previous and next controls
 * are intentionally inert (they keep the design's visual, but cannot navigate)
 * until those topics exist; no placeholder lesson copy is invented.
 *
 * Below `xl` the outline moves under the lesson so the reading surface comes
 * first on phones and tablets.
 */
export default function ModuleLessonPage() {
  const { pathSlug, moduleSlug } = useParams()

  if (pathSlug !== learningPath.slug) {
    return <Navigate to={learningPathUrl()} replace />
  }

  if (moduleSlug !== relationalDesignLesson.moduleSlug) {
    return <Navigate to={learningPathUrl(pathSlug)} replace />
  }

  const lesson = relationalDesignLesson
  const topicLabel = `Topic ${lesson.topicNumber} of ${lesson.totalTopics}`

  return (
    <div data-testid="lesson-page" className="flex w-full flex-col px-6 pt-7 pb-8 md:px-8 md:py-8 lg:p-10">
      <div data-testid="lesson-content" className="mx-auto flex w-full max-w-[1128px] flex-col gap-7">
        <header className="flex w-full flex-col gap-2">
          <h1 className="text-[28px] leading-[1.5] font-semibold text-[#17191f] md:text-[32px]">
            Relational Database Design
          </h1>
          <p className="text-[14px] leading-[1.5] font-normal text-[#686b73]">
            Module {lesson.moduleNumber} · {topicLabel} · About {lesson.minutes} minutes
          </p>
        </header>

        <div data-testid="lesson-columns" className="flex w-full flex-col items-start gap-7 xl:flex-row">
          <div className="order-2 flex w-full flex-col gap-4 xl:order-1 xl:w-[264px] xl:shrink-0">
            <LessonOutline
              path={learningPath}
              pathSlug={pathSlug}
              currentModule={{ moduleNumber: lesson.moduleNumber }}
            />
            <PracticePanel quiz={learningPath.quiz} />
          </div>

          <div className="order-1 flex w-full min-w-px flex-col gap-5 xl:order-2 xl:flex-1">
            <Panel data-testid="lesson-surface" className="flex w-full flex-col gap-[18px] p-6 sm:p-8">
              <span className="self-start rounded-[6px] bg-[#eef1ff] px-[10px] py-[5px] text-[11px] leading-[normal] font-medium whitespace-nowrap text-[#0033ff]">
                {lesson.badge}
              </span>

              <h2 className="text-[24px] leading-[1.5] font-semibold text-[#17191f]">
                {lesson.title}
              </h2>

              <p className="text-[14px] leading-[1.5] font-normal text-[#17191f]">
                {lesson.intro}
              </p>

              {lesson.sections.map((section) => (
                <Fragment key={section.title}>
                  <h3 className="text-[18px] leading-[1.5] font-semibold text-[#17191f]">
                    {section.title}
                  </h3>

                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[14px] leading-[1.5] font-normal text-[#17191f]"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.example && (
                    <div className="flex w-full flex-col gap-2 rounded-[6px] bg-[#eef1ff] p-5 text-[13px] leading-[20px] font-medium text-[#17191f]">
                      {section.example.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  )}
                </Fragment>
              ))}

              <div className="h-px w-full shrink-0 bg-[#deded9]" />

              <p className="text-[13px] leading-[20px] font-normal text-[#686b73]">
                {lesson.keyTakeaway}
              </p>
            </Panel>

            <div data-testid="lesson-footer" className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                disabled
                title="Available once the previous lesson is added."
                className="self-start text-left text-[13px] leading-[20px] font-medium whitespace-nowrap text-[#0033ff] disabled:cursor-not-allowed"
              >
                ← Previous: Joins
              </button>

              <p className="text-[11px] leading-[1.5] font-normal text-[#686b73] sm:flex-1">
                {topicLabel}
              </p>

              <div className="flex w-full items-center gap-4 sm:w-auto sm:shrink-0">
                <Link
                  to="/quizzes"
                  className="inline-flex min-h-11 flex-1 items-center text-[13px] leading-[20px] font-medium whitespace-nowrap text-[#0033ff] hover:underline sm:flex-none"
                >
                  Take quiz →
                </Link>

                <button
                  type="button"
                  disabled
                  title="Available once the next lesson is added."
                  className="inline-flex h-[48px] flex-1 items-center justify-center rounded-[10px] border border-solid border-[#0033ff] bg-[#0033ff] px-5 text-[13px] font-semibold whitespace-nowrap text-white disabled:cursor-not-allowed sm:w-[180px] sm:flex-none"
                >
                  Next lesson →
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] leading-[1.5] font-normal text-[#686b73]">
          Example student data · For design review only
        </p>
      </div>
    </div>
  )
}
