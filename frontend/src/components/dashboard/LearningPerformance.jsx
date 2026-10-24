import { TrendingUp } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'

/**
 * LearningPerformance — strip 3 panel (desktop): skor lime (360) | angka (280) | insight (sisa).
 * Di bawah 1024px panel menumpuk dengan garis pemisah 2px.
 */
export default function LearningPerformance() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Learning Performance" />

      <div className="flex w-full flex-col overflow-hidden border-2 border-solid border-[#171916] lg:flex-row">
        {/* Skor */}
        <div className="flex flex-col gap-2 bg-[#d5f35b] p-6 lg:w-[360px] lg:shrink-0">
          <p className="text-[10px] leading-[1.4] font-black text-[#62665c]">
            Latest quiz · SQL Fundamentals
          </p>
          <p className="leading-none font-black text-[#171916]">
            <span className="text-[72px] lg:text-[104px]">80</span>
            <span className="text-[36px] lg:text-[52px]">%</span>
          </p>
          <p className="text-[12px] font-black text-[#171916]">8 of 10 questions correct</p>
        </div>

        {/* Angka */}
        <div className="flex flex-col justify-center gap-4 border-y-2 border-solid border-[#171916] bg-white p-6 lg:w-[280px] lg:shrink-0 lg:border-y-0 lg:border-x-2">
          <div className="flex w-full items-center gap-[18px]">
            <p className="w-12 shrink-0 text-[44px] leading-none font-extrabold text-[#171916]">6</p>
            <p className="min-w-0 flex-1 text-[12px] leading-[1.4] font-normal text-[#62665c]">
              Quizzes completed
            </p>
          </div>
          <div className="flex w-full items-center gap-[18px]">
            <p className="w-12 shrink-0 text-[44px] leading-none font-extrabold text-[#171916]">4</p>
            <p className="min-w-0 flex-1 text-[12px] leading-[1.4] font-normal text-[#62665c]">
              Topics evaluated this week
            </p>
          </div>
        </div>

        {/* Insight */}
        <div className="flex min-w-0 flex-1 flex-col gap-[14px] bg-white p-6">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={20} strokeWidth={1.75} className="shrink-0 text-[#405c04]" aria-hidden="true" />
            <p className="text-[16px] font-bold text-[#171916]">Improving across recent quizzes</p>
          </div>
          <p className="text-[12px] leading-[1.5] font-normal text-[#62665c]">
            Recently evaluated: SELECT, filters, joins and grouping.
          </p>
          <p className="text-[12px] leading-[1.5] font-normal text-[#62665c]">
            A quiz is a snapshot, not the whole picture. Revisit joins before your next session.
          </p>
          <TextAction className="self-start">View performance →</TextAction>
        </div>
      </div>
    </section>
  )
}