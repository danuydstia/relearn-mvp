import Avatar from '../ui/Avatar.jsx'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'
import { useAuth } from '../../contexts/AuthContext'

/**
 * TopBar — design node 2:7956 ("Re:Learn/Top bar").
 * Desktop/tablet (≥768px): 80px tall, bottom border #dad9d4, 40px gutters.
 *   Left: current page. Right: plan badge, name, avatar.
 * Mobile (<768px, design 2:6327): 80px tall, 24px gutters, no bottom border
 *   (the mobile bar supplies the 1px rule), wordmark on the left and just the
 *   badge + avatar on the right — the page title and the name are dropped.
 */
export default function TopBar({ title = 'Dashboard' }) {
  const { user } = useAuth()
  const name = user?.name || 'Student'

  return (
    <header className="flex h-20 shrink-0 items-center justify-between bg-white px-6 md:border-b md:border-solid md:border-[#dad9d4] md:px-10">
      <img src="/relearn-full-logo.svg" alt="Re:Learn" className="h-6 w-auto md:hidden" />
      <p className="hidden text-[14px] font-medium whitespace-nowrap text-[#17191f] md:block">
        {title}
      </p>
      <div className="flex shrink-0 items-center gap-3">
        <SubscriptionBadge plan={user?.plan} />
        <p className="hidden text-[13px] font-medium whitespace-nowrap text-[#17191f] md:block">
          {name}
        </p>
        <Avatar name={name} />
      </div>
    </header>
  )
}
