import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import MobileNav from './MobileNav.jsx'
import MoreSheet from './MoreSheet.jsx'
import DevPlanSwitcher from '../dev/DevPlanSwitcher.jsx'

/**
 * AppShell — the authenticated application frame.
 *
 * Three layouts, driven by two Tailwind breakpoints (md = 768px, lg = 1024px):
 * - Desktop (≥1024px): 232px labelled sidebar + content column.
 * - Tablet (768–1023px, design 2:6872): 88px icon-only sidebar + content column.
 * - Mobile (<768px, design 2:6326): no sidebar. The content column itself carries
 *   the top bar and a 76px horizontal tab bar above the page body.
 */
export default function AppShell({ title = 'Dashboard', children }) {
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    document.title = title ? `${title} · ReLearn` : 'ReLearn'
  }, [title])

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f7f3] md:flex-row">
      {/* Full-height white rail; hidden on mobile, narrows to icons on tablet.
          The divider is an inset shadow rather than a border so it doesn't
          consume a pixel of the rail's content width — the design's nav items
          are 52px inside an 88px rail and 192px inside a 232px rail. */}
      <div className="hidden shrink-0 bg-white md:block md:w-[88px] md:shadow-[inset_-1px_0_0_0_#dad9d4] lg:w-[232px]">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />
        <MobileNav onMoreClick={() => setMoreOpen(true)} moreOpen={moreOpen} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
      <DevPlanSwitcher />
    </div>
  )
}
