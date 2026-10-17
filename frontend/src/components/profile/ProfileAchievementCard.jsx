import { Award } from 'lucide-react'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

/**
 * ProfileAchievementCard — "Achievement" (design 60:9114).
 *
 * The dashboard's Achievement card emblem (design node 2:6033) on its own:
 * the Profile screen shows the badge and its earned date, not the reward-token
 * row or the Achievements / Leaderboard actions.
 */
export default function ProfileAchievementCard() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Achievement" />

      <Card className="flex w-full items-center gap-3 p-5 md:p-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[6px] bg-[#eef1ff]">
          <Award size={20} strokeWidth={1.75} className="text-[#0033ff]" aria-hidden="true" />
        </span>
        <div className="flex min-w-px flex-1 flex-col gap-[3px] leading-[1.5]">
          <p className="text-[13px] font-semibold text-[#17191f]">First path completed</p>
          <p className="text-[11px] font-normal text-[#686b73]">Earned · 28 September</p>
        </div>
      </Card>
    </section>
  )
}
