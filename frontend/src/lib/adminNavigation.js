import {
  Award,
  BookOpen,
  ChartNoAxesCombined,
  ClipboardCheck,
  Files,
  LayoutDashboard,
  Trophy,
  Users,
} from 'lucide-react'

/**
 * Admin console navigation (design 10:62424).
 *
 * Icons and grouping mirror the design's own sidebar. Overview and Users are
 * built: every other destination renders the shared "not available yet" panel
 * inside the admin shell.
 */
export const ADMIN_NAV_GROUPS = [
  {
    label: 'Management',
    items: [
      { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/admin/users', label: 'Users', icon: BookOpen },
      { to: '/admin/subscriptions', label: 'Subscriptions', icon: Files },
      { to: '/admin/transactions', label: 'Transactions', icon: ClipboardCheck },
      { to: '/admin/moderation', label: 'Moderation', icon: Users },
    ],
  },
  {
    label: 'Platform',
    items: [
      { to: '/admin/communities', label: 'Communities', icon: ChartNoAxesCombined },
      { to: '/admin/ai-usage', label: 'AI usage', icon: Award },
      { to: '/admin/system', label: 'System monitor', icon: Trophy },
    ],
  },
]

/** The console landing screen. */
export const ADMIN_OVERVIEW_PATH = '/admin/overview'

/** The account list (design 10:62689). */
export const ADMIN_USERS_PATH = '/admin/users'

/**
 * Where an account lands after signing in.
 *
 * Admins run the platform rather than study on it, so they arrive straight at
 * the console. The student side stays reachable — the console shell links back
 * to it, and nothing redirects the dashboard away.
 */
export function landingPathFor(user) {
  return user?.role === 'admin' ? ADMIN_OVERVIEW_PATH : '/dashboard'
}

/** Destinations that still show the "not available yet" panel. */
export const ADMIN_PENDING_ITEMS = ADMIN_NAV_GROUPS.flatMap((group) => group.items).filter(
  ({ to }) => to !== ADMIN_OVERVIEW_PATH && to !== ADMIN_USERS_PATH,
)
