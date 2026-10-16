import { TrendingUp } from 'lucide-react'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'

/**
 * LearningPerformance — design nodes 2:8084 (heading), 2:8087 (summary card).
 */
export default function LearningPerformance() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Learning Performance" />

      <Card className="flex w-full flex-col gap-4 p-6">
        <div className="flex w-full flex-col gap-1">
          <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
            Latest quiz · SQL Fundamentals
          </p>
          <p className="text-[40px] leading-[normal] font-semibold text-[#17191f]">
            80<span className="text-[23px]">%</span>
          </p>
          <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
            8 of 10 questions correct
          </p>
        </div>

        <div className="h-px w-full shrink-0 bg-[#dad9d4]" />

        <div className="flex w-full items-start gap-5 leading-[1.5]">
          <div className="flex min-w-px flex-1 flex-col gap-1">
            <p className="text-[23px] font-semibold text-[#17191f]">6</p>
            <p className="text-[11px] font-normal text-[#686b73]">Quizzes completed</p>
          </div>
          <div className="flex min-w-px flex-1 flex-col gap-1">
            <p className="text-[23px] font-semibold text-[#17191f]">4</p>
            <p className="text-[11px] font-normal text-[#686b73]">Topics evaluated this week</p>
          </div>
        </div>

        <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
          Recently evaluated: SELECT, filters, joins and grouping.
        </p>

        <div className="flex w-full items-center gap-2">
          <TrendingUp size={20} strokeWidth={1.75} className="shrink-0 text-[#17191f]" aria-hidden="true" />
          <p className="min-w-px flex-1 text-[12px] leading-[1.5] font-medium text-[#17191f]">
            Improving across recent quizzes
          </p>
        </div>

        <p className="text-[11px] leading-[1.5] font-normal text-[#686b73]">
          A quiz is a snapshot, not the whole picture. Revisit joins before your next session.
        </p>

        <TextAction>View performance →</TextAction>
      </Card>
    </section>
  )
}
