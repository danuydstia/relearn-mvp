import { Link, NavLink } from 'react-router-dom'
import Avatar from '../ui/Avatar.jsx'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'
import { useAuth } from '../../contexts/AuthContext'
import { NAV_GROUPS, ADMIN_NAV_ITEM } from '../../lib/navigation'

/**
 * Sidebar.
 * Desktop (≥1024px): lebar 280px. Header: wordmark teks, tagline, baris user
 *   (nama, badge plan, avatar kotak → link ke Profile), border bawah 2px.
 *   Lalu grup menu. Blok AI usage sudah pindah ke kartu lime di dashboard.
 * Tablet (768–1023px): rail ikon saja, tanda "R", tanpa label grup.
 * Mobile (<768px): tidak dirender; tab bar mobile yang tampil.
 *
 * Catatan: aksi "Log out" di bawah Settings adalah tambahan di luar desain.
 */
const NAV_ITEM_BASE =
  'flex h-11 w-full items-center justify-center rounded-[8px] border border-solid text-[12px] transition-colors duration-150 ease-out cursor-pointer lg:h-[38px] lg:justify-start lg:gap-[7px] lg:px-[10px]'

/** Item aktif: lime + outline ink. */
const navItemClass = (isActive = false) =>
  `${NAV_ITEM_BASE} ${
    isActive
      ? 'border-[#171916] bg-[#d5f35b] font-extrabold text-[#171916]'
      : 'border-transparent bg-transparent font-medium text-[#171916] hover:bg-[#f2f1ec]'
  }`

/** Aksi destruktif (Log out). */
const navActionClass = `${NAV_ITEM_BASE} border-transparent font-medium text-[#b42318] hover:bg-[#fff5f2]`

/** Ikon entri admin, hanya untuk akun admin. */
const AdminNavIcon = ADMIN_NAV_ITEM.icon

export default function Sidebar() {
  const { user, logout } = useAuth()
  const name = user?.name || 'Student'

  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col overflow-y-auto border-r-2 border-solid border-[#171916] bg-white">
      <div className="flex w-full flex-col gap-4 border-b-2 border-solid border-[#171916] px-[18px] pt-6 pb-5 lg:px-5">
        {/* Desktop: wordmark teks; tablet: tanda "R". */}
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-[38px] leading-none font-black text-[#171916]">Re:Learn</span>
          <span className="h-8 w-[2px] bg-[#171916]" aria-hidden="true" />
        </div>
        <img src="/relearn-logo.svg" alt="Re:Learn" className="block h-6 w-auto self-start lg:hidden" />

        <p className="hidden text-[10px] leading-[15px] font-black text-[#62665c] lg:block">
          Your learning,
          <br />
          in motion.
        </p>

        <Link
          to="/profile"
          aria-label={`${name} — profile`}
          className="hidden w-full items-center gap-3 rounded-[8px] outline-offset-4 lg:flex"
        >
          <p className="min-w-0 truncate text-[13px] font-bold text-[#171916]">{name}</p>
          <SubscriptionBadge plan={user?.plan} />
          <Avatar name={name} src={user?.avatar_url} shape="square" className="ml-auto" />
        </Link>
      </div>

      <nav className="flex w-full flex-col gap-6 px-[18px] py-5 lg:p-5">
        {NAV_GROUPS.map((group) => {
          const ActionIcon = group.action?.icon

          return (
            <div key={group.label} className="flex w-full flex-col gap-2">
              <p className="hidden shrink-0 text-[9px] font-black uppercase text-[#62665c] lg:block">
                {group.label}
              </p>
              <div className="flex w-full flex-col gap-1">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    title={label}
                    className={({ isActive }) => navItemClass(isActive)}
                  >
                    <Icon size={16} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
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
                      size={16}
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
                      size={16}
                      strokeWidth={1.75}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                    <span className="hidden whitespace-nowrap lg:inline">
                      {group.action.label}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}