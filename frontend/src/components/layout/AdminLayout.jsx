import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import { useAuth } from '../../contexts/AuthContext'
import { ADMIN_NAV_GROUPS } from '../../lib/adminNavigation'

const NAV_ITEM_BASE =
  'flex h-11 w-full items-center rounded-[6px] text-[13px] font-medium transition-colors duration-150 ease-out'

const todayLabel = new Date().toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/**
 * AdminLayout — the admin console frame (design node 10:62479).
 *
 * 232px sidebar + 80px top bar, content inset by 32px. The design only has a
 * desktop frame, so viewports under 1280px get an explicit notice instead of a
 * collapsed layout, and there is no mobile navigation.
 */
export default function AdminLayout({ title = 'Admin', children }) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = title ? `${title} · Admin · ReLearn` : 'Admin · ReLearn'
  }, [title])

  return (
    <>
      <div className="hidden min-h-screen w-full min-[1280px]:flex">
        <aside
          className={`sticky top-0 flex h-screen shrink-0 flex-col gap-8 overflow-y-auto border-r border-[#dad9d4] bg-white px-5 pt-8 pb-7 ${
            collapsed ? 'w-[88px]' : 'w-[232px]'
          }`}
        >
          <img
            src={collapsed ? '/relearn-logo.svg' : '/relearn-full-logo.svg'}
            alt="Re:Learn"
            className="h-6 w-auto self-start"
          />

          <nav className="flex w-full flex-col gap-6">
            {ADMIN_NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex w-full flex-col gap-2">
                {!collapsed && (
                  <p className="w-full text-[10px] font-medium uppercase text-[#686b73]">
                    {group.label}
                  </p>
                )}
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    title={label}
                    className={({ isActive }) =>
                      `${NAV_ITEM_BASE} ${collapsed ? 'justify-center' : 'gap-3 px-3'} ${
                        isActive ? 'bg-[#eef1ff] text-[#0033ff]' : 'text-[#17191f] hover:bg-[#f8f7f3]'
                      }`
                    }
                  >
                    <Icon size={20} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="whitespace-nowrap">{label}</span>}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <div className="w-full border-t border-[#d9d9d9] pt-5">
            {collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                title="Expand navigation"
                className="flex h-11 w-full items-center justify-center rounded-[6px] text-[#0033ff] hover:bg-[#f8f7f3]"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <div className="flex w-full flex-col gap-5">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-start justify-between">
                    <p className="text-[12px] font-medium whitespace-nowrap text-[#17191f]">
                      Admin space
                    </p>
                    <span className="rounded-[6px] bg-[#f2f1ec] px-[9px] py-[4px] text-[11px] font-medium whitespace-nowrap text-[#686b73]">
                      Internal
                    </span>
                  </div>
                  <p className="w-full text-[12px] leading-[1.5] font-normal text-[#686b73]">
                    Limited access for the Re:Learn team.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCollapsed(true)}
                    className="flex min-h-[44px] items-center gap-1 text-[12px] font-medium whitespace-nowrap text-[#0033ff]"
                  >
                    Collapse navigation
                    <ChevronLeft size={14} aria-hidden="true" />
                  </button>
                </div>
                <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">
                  Data as of {todayLabel}
                </p>
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-20 shrink-0 items-center gap-4 border-b border-[#dad9d4] bg-white pr-4 pl-8">
            <div className="flex h-10 w-[408px] shrink-0 items-center gap-2 rounded-[6px] border border-[#dad9d4] bg-white px-3">
              <Search size={16} className="shrink-0 text-[#686b73]" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search"
                placeholder="Search users, transactions or reports…"
                className="w-full min-w-0 border-0 bg-transparent text-[11px] leading-[1.5] text-[#17191f] outline-none placeholder:text-[#686b73]"
              />
            </div>

            <div className="min-w-0 flex-1" />

            <button
              type="button"
              title="Notifications"
              className="relative flex size-10 shrink-0 items-center justify-center rounded-[6px] border border-[#dad9d4] bg-white"
            >
              <Bell size={18} strokeWidth={1.75} className="text-[#17191f]" aria-hidden="true" />
              <span className="absolute top-[6px] left-[25px] size-[5px] rounded-[3px] bg-[#0033ff]" />
            </button>

            <div className="relative flex h-20 w-[320px] shrink-0 items-center px-10">
              <div className="flex items-center gap-3">
                <span className="rounded-[6px] bg-[#f2f1ec] px-[9px] py-[4px] text-[11px] font-medium whitespace-nowrap text-[#686b73]">
                  Admin
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-1 text-[13px] font-medium whitespace-nowrap text-[#17191f]"
                >
                  {user?.name}
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                <Avatar name={user?.name} src={user?.avatar_url} size={40} />
              </div>

              {menuOpen && (
                <div className="absolute top-[72px] right-4 z-10 flex w-[200px] flex-col rounded-[12px] border border-[#dad9d4] bg-white p-2 shadow-[0_8px_24px_rgba(23,25,31,0.12)]">
                  <NavLink
                    to="/dashboard"
                    className="flex h-10 items-center rounded-[6px] px-3 text-[13px] font-medium text-[#17191f] hover:bg-[#f8f7f3]"
                  >
                    Back to app
                  </NavLink>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex h-10 items-center rounded-[6px] px-3 text-left text-[13px] font-medium text-[#b42318] hover:bg-[#fff5f2]"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </header>

          <main className="flex min-w-0 flex-1 flex-col p-8">{children}</main>
        </div>
      </div>

      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f7f3] px-6 min-[1280px]:hidden">
        <div className="w-full max-w-[420px] rounded-[12px] border border-[#dad9d4] bg-white p-8 text-center">
          <p className="text-[18px] font-bold text-[#17191f]">
            The admin console needs a wider screen
          </p>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#686b73]">
            Open it on a display at least 1280px wide. Student pages work at every size.
          </p>
        </div>
      </div>
    </>
  )
}
