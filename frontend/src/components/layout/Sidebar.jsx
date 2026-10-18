import { NavLink } from 'react-router-dom'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'
import { useAuth } from '../../contexts/AuthContext'
import { NAV_GROUPS, ADMIN_NAV_ITEM } from '../../lib/navigation'

/**
 * Sidebar — design node 2:7900 ("Re:Learn/Sidebar").
 * Desktop (≥1024px): 232px, wordmark, group labels, icon + label items,
 *   account-usage block pinned below the nav.
 * Tablet (768–1023px, design 2:6872): 88px, "R" mark, icon-only items with no
 *   group labels and no account-usage block — that block moves into the page.
 * Mobile (<768px): not rendered at all; the mobile tab bar takes over.
 *
 * Note: the "Log out" action below Settings is an addition on top of the
 * design, which only lists Settings under Account.
 */
const NAV_ITEM_BASE =
  'flex h-11 w-full items-center justify-center rounded-[6px] text-[13px] font-medium transition-colors duration-150 ease-out cursor-pointer lg:justify-start lg:gap-3 lg:px-3'

/** Link styling — the active item picks up the brand tint. */
const navItemClass = (isActive = false) =>
  `${NAV_ITEM_BASE} ${
    isActive ? 'bg-[#eef1ff] text-[#0033ff]' : 'bg-white text-[#17191f] hover:bg-[#f8f7f3]'
  }`

/** Destructive action styling (Log out) — reuses the danger token + error-soft hover. */
const navActionClass = `${NAV_ITEM_BASE} text-[#b42318] hover:bg-[#fff5f2]`

/** Admin entry icon, rendered only for admin accounts. */
const AdminNavIcon = ADMIN_NAV_ITEM.icon

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isPro = user?.plan === 'pro'

  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col gap-8 overflow-y-auto bg-white px-[18px] pt-8 pb-7 lg:px-5">
      {/* Desktop wordmark; the tablet rail shows the compact "R" mark instead. */}
      <img
        src="/relearn-full-logo.svg"
        alt="Re:Learn"
        className="hidden h-6 w-auto self-start lg:block"
      />
      <img src="/relearn-logo.svg" alt="Re:Learn" className="block h-6 w-auto self-start lg:hidden" />

      <nav className="flex w-full flex-col gap-6">
        {NAV_GROUPS.map((group) => {
          const ActionIcon = group.action?.icon

          return (
            <div key={group.label} className="flex w-full flex-col gap-2">
              <p className="hidden shrink-0 text-[10px] font-medium uppercase text-[#686b73] lg:block">
                {group.label}
              </p>
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  title={label}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  <Icon size={20} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
                  <span className="hidden whitespace-nowrap lg:inline">{label}</span>
                </NavLink>
              ))}
              {group.action && user?.role === 'admin' && (
                <NavLink
                  to={ADMIN_NAV_ITEM.to}
                  title={ADMIN_NAV_ITEM.label}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  <AdminNavIcon
                    size={20}
                    strokeWidth={1.75}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span className="hidden whitespace-nowrap lg:inline">
                    {ADMIN_NAV_ITEM.label}
                  </span>
                </NavLink>
              )}
              {group.action && (
                <button
                  type="button"
                  onClick={logout}
                  title={group.action.label}
                  className={navActionClass}
                >
                  <ActionIcon
                    size={20}
                    strokeWidth={1.75}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span className="hidden whitespace-nowrap lg:inline">{group.action.label}</span>
                </button>
              )}
            </div>
          )
        })}
      </nav>

      <div className="hidden w-full shrink-0 flex-col gap-5 border-t border-solid border-[#dad9d4] pt-5 lg:flex">
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
