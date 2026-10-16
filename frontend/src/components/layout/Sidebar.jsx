import { NavLink } from 'react-router-dom'
import {
  Award,
  BookOpen,
  ChartNoAxesCombined,
  ClipboardCheck,
  Files,
  LayoutDashboard,
  LogOut,
  Settings,
  Trophy,
  Users,
} from 'lucide-react'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Sidebar — design node 2:7900 ("Re:Learn/Sidebar").
 * 232px wide, white, right border #dad9d4, 44px nav items, 6px radius,
 * active item bg #eef1ff / text #03f. Icons map 1:1 to Lucide.
 *
 * Note: the "Log out" action below Settings is an addition on top of the
 * design, which only lists Settings under Account.
 */
const NAV_GROUPS = [
  {
    label: 'Learn',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/learning', label: 'My Learning', icon: BookOpen },
      { to: '/materials', label: 'Materials', icon: Files },
      { to: '/quizzes', label: 'Quizzes', icon: ClipboardCheck },
      { to: '/communities', label: 'Communities', icon: Users },
    ],
  },
  {
    label: 'Your progress',
    items: [
      { to: '/progress', label: 'Progress', icon: ChartNoAxesCombined },
      { to: '/achievements', label: 'Achievements', icon: Award },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
    action: { label: 'Log out', icon: LogOut },
  },
]

/** Shared nav-item geometry, so links and actions line up exactly. */
const NAV_ITEM_BASE =
  'flex h-11 w-full items-center gap-3 rounded-[6px] px-3 text-[13px] font-medium transition-colors duration-150 ease-out cursor-pointer'

/** Link styling — the active item picks up the brand tint. */
const navItemClass = (isActive = false) =>
  `${NAV_ITEM_BASE} ${
    isActive ? 'bg-[#eef1ff] text-[#0033ff]' : 'bg-white text-[#17191f] hover:bg-[#f8f7f3]'
  }`

/** Destructive action styling (Log out) — reuses the danger token + error-soft hover. */
const navActionClass = `${NAV_ITEM_BASE} text-[#b42318] hover:bg-[#fff5f2]`

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isPro = user?.plan === 'pro'

  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col gap-8 overflow-y-auto bg-white px-5 pt-8 pb-7">
      <img src="/relearn-full-logo.svg" alt="Re:Learn" className="h-6 w-auto self-start" />
      <nav className="flex w-full flex-col gap-6">
        {NAV_GROUPS.map((group) => {
          const ActionIcon = group.action?.icon

          return (
            <div key={group.label} className="flex w-full flex-col gap-2">
              <p className="shrink-0 px-0 text-[10px] font-medium uppercase text-[#686b73]">
                {group.label}
              </p>
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  <Icon size={20} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{label}</span>
                </NavLink>
              ))}
              {group.action && (
                <button type="button" onClick={logout} className={navActionClass}>
                  <ActionIcon size={20} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{group.action.label}</span>
                </button>
              )}
            </div>
          )
        })}
      </nav>

      <div className="flex w-full shrink-0 flex-col gap-5 border-t border-solid border-[#dad9d4] pt-5">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between">
            <p className="text-[12px] font-medium whitespace-nowrap text-[#17191f]">AI usage</p>
            <SubscriptionBadge plan={user?.plan} />
          </div>
          <p className="w-full text-[12px] leading-[1.5] font-normal text-[#686b73]">
            Usage details will appear here.
          </p>
          {!isPro && (
            <div className="flex min-h-[44px] items-center">
              <NavLink
                to="/pro"
                className="text-[12px] font-medium whitespace-nowrap text-[#0033ff] hover:underline"
              >
                Explore Pro →
              </NavLink>
            </div>
          )}
        </div>
        <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">
          Your learning, in motion.
        </p>
      </div>
    </aside>
  )
}
