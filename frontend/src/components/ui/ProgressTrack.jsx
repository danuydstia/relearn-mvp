/**
 * ProgressTrack — 6px rounded track (#dde3ff) with a brand fill.
 * Design: "Progress track" / "Completed topics".
 */
export default function ProgressTrack({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`relative h-[6px] w-full overflow-clip rounded-full bg-[#dde3ff] ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute top-0 left-0 h-[6px] rounded-full bg-[#0033ff]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
