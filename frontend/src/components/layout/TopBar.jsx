import { Link } from 'react-router-dom'
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
 *
 * The right-hand account group is the entry point to Profile: the design's
 * "Top-right avatar → Profile" proposal (60:9231). Sidebar destinations and
 * Settings are untouched, as that spec requires.
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
      <Link
        to="/profile"
        aria-label={`${name} — profile`}
        className="flex shrink-0 items-center gap-3 rounded-[10px] outline-offset-4"
      >
        <SubscriptionBadge plan={user?.plan} />
        <p className="hidden text-[13px] font-medium whitespace-nowrap text-[#17191f] md:block">
          {name}
        </p>
        <Avatar name={name} src={user?.avatar_url} />
      </Link>
    </header>
  )
}
