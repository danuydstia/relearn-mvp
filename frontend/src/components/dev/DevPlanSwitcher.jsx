import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

/**
 * DevPlanSwitcher — development-only control that flips the signed-in user
 * between the Free and Pro dashboards without a real subscription.
 *
 * It renders only when Vite reports a dev build (`import.meta.env.DEV`), so it
 * is stripped from production bundles, and it calls the `/dev/plan` route,
 * which is itself registered only for the local and testing environments.
 */
export default function DevPlanSwitcher() {
  const { user, updatePlan } = useAuth()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!import.meta.env.DEV || !user) {
    return null
  }

  const isPro = user.plan === 'pro'
  const next = isPro ? 'free' : 'pro'

  const toggle = async () => {
    setBusy(true)
    setFailed(false)

    try {
      await updatePlan(next)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title="Development only — not included in production builds"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full border border-solid border-[#dad9d4] bg-[#17191f] px-3 py-2 text-[11px] font-medium text-white shadow-lg transition-opacity disabled:opacity-60"
    >
      <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] tracking-wide uppercase">
        dev
      </span>
      {busy
        ? 'Switching…'
        : failed
          ? 'Retry plan switch'
          : `Switch to ${next === 'pro' ? 'Pro' : 'Free'}`}
    </button>
  )
}
