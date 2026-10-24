import { Award } from 'lucide-react'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'

export default function ProgressAchievements() {
  return (
    <section className="flex w-full min-w-0 flex-col gap-[18px]">
      <SectionHeading
        title={
          <>
            Small steps,{' '}
            <br className="hidden lg:block" />
            real progress
          </>
        }
        className="lg:h-[58px] lg:items-end"
      />

      <Card className="flex min-h-[344px] w-full flex-1 flex-col gap-5 p-6">
        <div className="flex w-full items-center gap-2.5">
          <Award size={24} strokeWidth={1.7} className="shrink-0 text-[#171916]" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
            <p className="text-[13px] font-bold text-[#171916]">First path completed</p>
            <p className="text-[11px] leading-[1.5] font-normal text-[#62665c]">
              Earned · 28 September
            </p>
          </div>
        </div>

        <div className="h-px w-full shrink-0 bg-[#171916]" />

        <div className="flex w-full flex-col gap-1">
          <p className="text-[10px] leading-[1.4] font-black text-[#62665c]">Reward Tokens</p>
          <p className="text-[56px] leading-none font-black text-[#405c04] lg:text-[68px]">120</p>
        </div>

        <div className="flex w-full flex-col gap-0.5">
          <TextAction className="self-start">Achievements →</TextAction>
          <TextAction className="self-start">Leaderboard →</TextAction>
        </div>
      </Card>
    </section>
  )
}