import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import { MOBILE_MORE_ITEMS } from '../../lib/navigation'
import { useAuth } from '../../contexts/AuthContext'

/**
 * MoreSheet — the destination behind the mobile bar's fifth tab.
 *
 * The design only specifies the tab itself (design node 2:6333); there is no
 * designed panel for it, so this sheet is built from the app's existing tokens:
 * a white surface with a 16px top radius, 20px gutters, 48px rows, the 1px
 * #dad9d4 divider, and the destructive #b42318 / #fff5f2 pair already used by
 * the sidebar's Log out action.
 *
 * Only mounted below 768px, matching the tab bar that opens it.
 */
const ROW_BASE =
  'flex h-12 w-full items-center gap-3 rounded-[6px] px-3 text-[14px] font-medium transition-colors duration-150 ease-out cursor-pointer'

export default function MoreSheet({ open, onClose }) {
  const { logout } = useAuth()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#17191f]/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="More"
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[16px] bg-white px-5 pt-3 pb-8 shadow-[0_-8px_24px_rgba(23,25,31,0.12)] outline-none"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#dad9d4]" aria-hidden="true" />
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-medium text-[#686b73]">More</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#686b73] transition-colors duration-150 ease-out hover:bg-[#f8f7f3] hover:text-[#17191f]"
          >
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {MOBILE_MORE_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `${ROW_BASE} ${isActive ? 'bg-[#eef1ff] text-[#0033ff]' : 'text-[#17191f] hover:bg-[#f8f7f3]'}`
              }
            >
              <Icon size={20} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="my-2 border-t border-solid border-[#dad9d4]" />

        <button
          type="button"
          onClick={() => {
            onClose()
            logout()
          }}
          className={`${ROW_BASE} text-[#b42318] hover:bg-[#fff5f2]`}
        >
          <LogOut size={20} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Log out</span>
        </button>
      </div>
    </div>
  )
}
