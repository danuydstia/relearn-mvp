/**
 * SubscriptionBadge — "Free" / "Pro" pill.
 * Design: Subscription badge, bg #f2f1ec, px 9 / py 4, radius 6, 11px medium.
 */
export default function SubscriptionBadge({ plan = 'Free', className = '' }) {
  const isPro = String(plan).toLowerCase() === 'pro'
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-[6px] px-[9px] py-[4px] text-[11px] font-medium whitespace-nowrap ${
        isPro ? 'bg-[#eef1ff] text-[#0033ff]' : 'bg-[#f2f1ec] text-[#686b73]'
      } ${className}`}
    >
      {isPro ? 'Pro' : 'Free'}
    </span>
  )
}
