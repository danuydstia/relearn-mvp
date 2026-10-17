import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { MOBILE_TABS } from '../../lib/navigation'

/**
 * MobileNav — design node 2:6333 ("Mobile navigation").
 * A 76px horizontal bar sitting directly under the 80px top bar, visible only
 * below 768px. Five 64x72 tabs: four navigable destinations plus "More", which
 * opens a sheet (there is no designed panel for it — see MoreSheet).
 *
 * The bar's taxonomy is deliberately shorter than the sidebar's:
 * Home · Learning · Quizzes · Community · More.
 * The separator is this bar's top border, so TopBar drops its own border on
 * mobile to avoid a doubled 1px rule.
 */
const TAB_BASE =
  'flex h-[72px] w-16 flex-col items-center justify-center gap-[5px] transition-colors duration-150 ease-out cursor-pointer'

const tabClass = (isActive) =>
  `${TAB_BASE} ${isActive ? 'text-[#0033ff]' : 'text-[#686b73] hover:text-[#17191f]'}`

export default function MobileNav({ onMoreClick, moreOpen = false }) {
  return (
    <nav className="flex h-[76px] w-full shrink-0 items-center justify-between border-t border-solid border-[#dad9d4] bg-white px-3 md:hidden">
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
