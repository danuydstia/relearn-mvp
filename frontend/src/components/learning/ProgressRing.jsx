/**
 * ProgressRing — cincin progress A03 (100px) dan halaman generation (132px).
 * Gaya neo-brutalist: track #f7f7f2 dan fill lime #d5f35b, dibingkai garis
 * ink 2px di sisi dalam dan luar. Ujung fill dibuat lurus (butt) supaya
 * bingkainya tetap rapi. Ukuran angka di tengah mengikuti `size` (20% dari size).
 */
export default function ProgressRing({
  value = 0,
  size = 100,
  strokeWidth = 12,
  className = '',
}) {
  const pct = Math.max(0, Math.min(100, value))
  const edge = 2 // tebal garis ink di tiap sisi ring
  const radius = (size - strokeWidth - edge * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct / 100)

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(pct)}% complete`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Bingkai ink: sedikit lebih tebal dari ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#171916"
          strokeWidth={strokeWidth + edge * 2}
        />
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f7f7f2"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        {pct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#d5f35b"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        )}
      </svg>
      <span
        className="absolute leading-[normal] font-black text-[#171916]"
        style={{ fontSize: Math.round(size * 0.2) }}
      >
        {Math.round(pct)}%
      </span>
    </div>
  )
}