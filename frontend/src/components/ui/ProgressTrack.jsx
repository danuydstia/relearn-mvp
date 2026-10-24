/**
 * ProgressTrack — 6px rounded track (#f7f7f2, 1px ink outline) with a lime fill.
 * Design: "Progress track" / "Completed topics".
 */
export default function ProgressTrack({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`relative h-[6px] w-full overflow-clip rounded-full bg-[#f7f7f2] -outline-offset-1 outline outline-1 outline-solid outline-[#171916] ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute top-0 left-0 h-[6px] rounded-full bg-[#d5f35b]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}