import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { MOBILE_TABS } from '../../lib/navigation'

/**
 * MobileNav — design node 2:6333 ("Mobile navigation").
 * A 76px horizontal bar sitting directly under the 80px top bar, visible only
 * below 768px. Five 72px-tall tabs: four navigable destinations plus "More",
 * which opens a sheet (there is no designed panel for it — see MoreSheet).
 *
 * The bar's taxonomy is deliberately shorter than the sidebar's:
 * Home · Learning · Quizzes · Community · More.
 * The separator is this bar's top border, so TopBar drops its own border on
 * mobile to avoid a doubled 1px rule.
 *
 * The tabs divide the row evenly rather than sitting at a fixed width: the
 * design measures 70.2px per tab at 375 and 59.2px at 320 — exactly (width−24)/5
 * — so `flex-1` is the rule. A fixed 64px overflowed at 320px.
 */
const TAB_BASE =
  'flex h-[72px] min-w-0 flex-1 flex-col items-center justify-center gap-[5px] transition-colors duration-150 ease-out cursor-pointer'

const tabClass = (isActive) =>
  `${TAB_BASE} ${isActive ? 'text-[#0033ff]' : 'text-[#686b73] hover:text-[#17191f]'}`

export default function MobileNav({ onMoreClick, moreOpen = false }) {
  return (
    <nav className="flex h-[76px] w-full shrink-0 items-center border-t border-solid border-[#dad9d4] bg-white px-3 md:hidden">
      {MOBILE_TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => tabClass(isActive)}>
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
          <span className="text-[9px] font-medium">{label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        onClick={onMoreClick}
        aria-haspopup="dialog"
        aria-expanded={moreOpen}
        className={tabClass(moreOpen)}
      >
        <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
        <span className="text-[9px] font-medium">More</span>
      </button>
    </nav>
  )
}
