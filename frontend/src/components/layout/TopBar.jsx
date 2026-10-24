import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar.jsx'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'
import { useAuth } from '../../contexts/AuthContext'

/**
 * TopBar.
 * Desktop/tablet (≥768px): 80px tall, 2px bottom border #171916, 40px gutters.
 *   Left: current page. Right: plan badge, name, avatar.
 * Mobile (<768px): 80px tall, 24px gutters, no bottom border (the mobile bar
 *   supplies the rule), wordmark on the left and just the badge + avatar on the
 *   right.
 *
 * The right-hand account group is the entry point to Profile.
 */
export default function TopBar({ title = 'Dashboard' }) {
  const { user } = useAuth()
  const name = user?.name || 'Student'

  return (
    <header className="flex h-20 shrink-0 items-center justify-between bg-white px-6 md:border-b-2 md:border-solid md:border-[#171916] md:px-10">
      <img src="/relearn-full-logo.svg" alt="Re:Learn" className="h-6 w-auto md:hidden" />
      <p className="hidden text-[14px] font-black whitespace-nowrap text-[#17191f] md:block">
        {title}
      </p>
      <Link
        to="/profile"
        aria-label={`${name} — profile`}
        className="flex shrink-0 items-center gap-3 rounded-[8px] outline-offset-4"
      >
        <SubscriptionBadge plan={user?.plan} />
        <p className="hidden text-[13px] font-black whitespace-nowrap text-[#17191f] md:block">
          {name}
        </p>
        <Avatar name={name} shape="square" src={user?.avatar_url} />
      </Link>
    </header>
  )
}