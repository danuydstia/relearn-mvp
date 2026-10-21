/**
 * Skeleton — placeholder loading block with smooth pulse animation.
 */
export default function Skeleton({ className = '', rounded = 'rounded-[8px]' }) {
  return (
    <div
      className={`animate-pulse bg-[#e8e7e1] ${rounded} ${className}`}
      aria-hidden="true"
    />
  )
}

