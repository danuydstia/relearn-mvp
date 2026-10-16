import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import DevPlanSwitcher from '../dev/DevPlanSwitcher.jsx'

/**
 * AppShell — the authenticated application frame.
 * Sidebar (white) + content column. Top bar is white, page body is canvas.
 */
export default function AppShell({ title = 'Dashboard', children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f7f3]">
      {/* Full-height white rail; the nav itself stays sticky within it. */}
      <div className="w-[232px] shrink-0 border-r border-solid border-[#dad9d4] bg-white">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <DevPlanSwitcher />
    </div>
  )
}
