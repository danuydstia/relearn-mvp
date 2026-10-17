import IdentityCard from '../components/profile/IdentityCard.jsx'
import ProfileOverviewCard from '../components/profile/ProfileOverviewCard.jsx'
import ProfileAchievementCard from '../components/profile/ProfileAchievementCard.jsx'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProfilePage — "Re:Learn · Profile" (design 60:9005 desktop, 60:8193 at 375,
 * 60:8043 at 320).
 *
 * A bounded 1128px content column, 40px gutters from 1024px up (the design's
 * "desktop content is bounded rather than stretched", 60:9231), collapsing to
 * 24px gutters on mobile. Page rhythm is 32px throughout.
 *
 * Learning overview and Achievement are the dashboard's staged example data —
 * the design footnotes both as "Example student data · For design review only".
 */
export default function ProfilePage() {
  const { user } = useAuth()
  console.log('user:', user)
  const name = user?.name || 'Student'

  return (
    <div className="flex w-full flex-col px-6 pt-7 pb-8 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="flex w-full max-w-[1128px] flex-col gap-8">
        <div className="flex w-full flex-col gap-2">
          <h1 className="w-full text-[28px] leading-[1.5] font-semibold text-[#17191f] lg:text-[32px]">
            Profile
          </h1>
          <p className="w-full text-[14px] leading-[1.5] font-normal text-[#686b73]">
            Your identity and a little of your learning journey.
          </p>
        </div>

        <IdentityCard name={name} avatar={user?.avatar_url} />

        {/* Learning highlights — stacked at 32/28px on mobile, two equal
            columns from 768px. */}
        <div className="flex w-full flex-col gap-7 md:grid md:grid-cols-2 md:items-start md:gap-6">
          <ProfileOverviewCard />
          <ProfileAchievementCard />
        </div>

        <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">
          Example student data · For design review only
        </p>
      </div>
    </div>
  )
}
