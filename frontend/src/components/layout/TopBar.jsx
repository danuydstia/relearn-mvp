import Avatar from '../ui/Avatar.jsx'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'
import { useAuth } from '../../contexts/AuthContext'

/**
 * TopBar — design node 2:7956 ("Re:Learn/Top bar").
 * 80px tall, bottom border #dad9d4, 40px horizontal padding.
 * Left: current page. Right: plan badge, name, avatar.
 */
export default function TopBar({ title = 'Dashboard' }) {
  const { user } = useAuth()
  const name = user?.name || 'Student'

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-solid border-[#dad9d4] bg-white px-10">
      <p className="text-[14px] font-medium whitespace-nowrap text-[#17191f]">{title}</p>
      <div className="flex shrink-0 items-center gap-3">
        <SubscriptionBadge plan={user?.plan} />
        <p className="text-[13px] font-medium whitespace-nowrap text-[#17191f]">{name}</p>
        <Avatar name={name} />
      </div>
    </header>
  )
}
