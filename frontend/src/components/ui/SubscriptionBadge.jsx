/**
 * SubscriptionBadge — pill "Free" / "Pro".
 * Desain: lime #d5f35b, outline 1px ink, px 8 / py 4, 11px black.
 * Free dan Pro tampil sama; bedanya hanya teks.
 */
export default function SubscriptionBadge({ plan = 'Free', className = '' }) {
  const isPro = String(plan).toLowerCase() === 'pro'
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border border-solid border-[#171916] bg-[#d5f35b] px-2 py-1 text-[11px] leading-[normal] font-black whitespace-nowrap text-[#171916] ${className}`}
    >
      {isPro ? 'Pro' : 'Free'}
    </span>
  )
}