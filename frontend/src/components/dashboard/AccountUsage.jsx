import { NavLink } from 'react-router-dom'
import Card from '../ui/Card.jsx'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'
import { useAuth } from '../../contexts/AuthContext'

/**
 * AccountUsage. Below 1024px the sidebar's AI-usage block moves into the page
 * flow as a card (24px padding, 8px radius, 8px internal rhythm), because the
 * tablet rail is icon-only and the mobile layout has no rail at all.
 */
export default function AccountUsage({ className = '' }) {
  const { user } = useAuth()
  const isPro = user?.plan === 'pro'

  return (
    <Card className={`flex w-full flex-col p-6 ${className}`}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-start justify-between">
          <p className="text-[12px] leading-[normal] font-black whitespace-nowrap text-[#17191f]">
            AI usage
          </p>
          <SubscriptionBadge plan={user?.plan} />
        </div>
        <p className="w-full text-[12px] leading-[1.5] font-medium text-[#62665c]">
          Usage details will appear here.
        </p>
        {!isPro && (
          <div className="flex min-h-11 items-center">
            <NavLink
              to="/pro"
              className="text-[12px] leading-[normal] font-black whitespace-nowrap text-[#405c04] hover:underline"
            >
              Explore Pro →
            </NavLink>
          </div>
        )}
      </div>
    </Card>
  )
}