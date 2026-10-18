import {
  Award,
  BookOpen,
  ChartNoAxesCombined,
  ClipboardCheck,
  Files,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-react'

/**
 * Single source of truth for navigation, shared by the desktop/tablet sidebar,
 * the mobile tab bar and the mobile "More" sheet so they cannot drift apart.
 *
 * Labels differ between desktop and mobile because the mobile tab bar uses
 * shorter names in the design (design node 2:6333).
 */
export const NAV_GROUPS = [
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

/**
 * Extra destination only admin accounts see, appended to the Account group.
 * Admins keep access to the student shell — they land on the console at sign-in
 * (see landingPathFor) but nothing redirects the student pages away from them.
 */
export const ADMIN_NAV_ITEM = {
  to: '/admin/overview',
  label: 'Admin',
  icon: ShieldCheck,
}

/**
 * The four real tabs of the mobile bar (design 2:6333). "More" is the fifth and
 * is rendered separately because it opens a sheet instead of navigating.
 */
export const MOBILE_TABS = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/learning', label: 'Learning', icon: BookOpen },
  { to: '/quizzes', label: 'Quizzes', icon: ClipboardCheck },
  { to: '/communities', label: 'Community', icon: Users },
]

/** Destinations reachable only through the mobile "More" sheet. */
export const MOBILE_MORE_ITEMS = [
  { to: '/materials', label: 'Materials', icon: Files },
  { to: '/progress', label: 'Progress', icon: ChartNoAxesCombined },
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
]
