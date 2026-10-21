/**
 * LoadingSpinner — Reusable spinner component styled with Re:Learn brand tokens.
 */
export default function LoadingSpinner({
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  label = 'Loading...',
}) {
  const sizeClasses = {
    sm: 'size-5 border-2',
    md: 'size-8 border-2',
    lg: 'size-12 border-3',
  }

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-[#dde3ff] border-t-[#0033ff]`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

