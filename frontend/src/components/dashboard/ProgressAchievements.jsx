import { Award } from 'lucide-react'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'

/**
 * ProgressAchievements — design nodes 2:8124 (heading), 2:8127 (highlights card).
 */
export default function ProgressAchievements() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Small steps, real progress" />

      <Card className="flex w-full flex-col gap-4 p-6">
        <div className="flex w-full items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[6px] bg-[#eef1ff]">
            <Award size={20} strokeWidth={1.75} className="text-[#0033ff]" aria-hidden="true" />
          </span>
          <div className="flex min-w-px flex-1 flex-col gap-[3px] leading-[1.5]">
            <p className="text-[13px] font-semibold text-[#17191f]">First path completed</p>
            <p className="text-[11px] font-normal text-[#686b73]">Earned · 28 September</p>
          </div>
        </div>

        <div className="h-px w-full shrink-0 bg-[#dad9d4]" />

        <div className="flex w-full items-center justify-between">
          <p className="min-w-px flex-1 text-[12px] leading-[1.5] font-normal text-[#686b73]">
            Reward Tokens
          </p>
          <p className="text-[16px] leading-[normal] font-semibold whitespace-nowrap text-[#17191f]">120</p>
        </div>

        <div className="flex w-full items-start justify-between">
          <TextAction>Achievements →</TextAction>
          <TextAction>Leaderboard →</TextAction>
        </div>
      </Card>
    </section>
  )
}
