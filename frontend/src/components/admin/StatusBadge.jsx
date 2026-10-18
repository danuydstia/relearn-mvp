/**
 * StatusBadge — payment/processing state pill (design node 10:62646).
 * Tones come straight from the design's variants. Account status reuses the
 * same palette: Active carries the settled green, Suspended the failed red.
 */
const TONES = {
  paid: 'bg-[#edf7f1] text-[#217353]',
  pending: 'bg-[#fff6e3] text-[#91620f]',
  failed: 'bg-[#fff0ed] text-[#a53932]',
  active: 'bg-[#edf7f1] text-[#217353]',
  suspended: 'bg-[#fff0ed] text-[#a53932]',
}

export default function StatusBadge({ tone = 'paid', children }) {
  return (
    <span
      className={`inline-flex shrink-0 items-start rounded-[6px] px-2 py-[3px] text-[11px] leading-[1.5] whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
