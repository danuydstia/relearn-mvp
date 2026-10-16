/**
 * Avatar — initials circle.
 * Design: Simple Design System / Avatar (Initial, Large) — 40px circle.
 * Initials should be single characters where possible (per Figma docs).
 */
function initialsFrom(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase()
}

export default function Avatar({ name, initials, size = 40, className = '' }) {
  const label = initials || initialsFrom(name)
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#f2f1ec] text-[13px] font-medium text-[#17191f] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {label}
    </span>
  )
}
