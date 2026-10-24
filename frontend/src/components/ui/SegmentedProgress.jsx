/**
 * SegmentedProgress — progress berkotak: satu kotak per topik.
 * tone="light" untuk kartu putih, tone="dark" untuk kartu hitam.
 */
export default function SegmentedProgress({ done = 0, total = 1, tone = 'light', className = '' }) {
  const safeTotal = Math.max(1, total)
  const filled = Math.max(0, Math.min(safeTotal, done))
  const dark = tone === 'dark'

  return (
    <div
      className={`flex w-full gap-[5px] ${className}`}
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
    >
      {Array.from({ length: safeTotal }, (_, i) => (
        <span
          key={i}
          className={`h-[10px] min-w-0 flex-1 border border-solid ${
            dark ? 'border-[#bcc0b5]' : 'border-[#171916]'
          } ${i < filled ? 'bg-[#d5f35b]' : dark ? 'bg-[#454940]' : 'bg-[#f7f7f2]'}`}
        />
      ))}
    </div>
  )
}