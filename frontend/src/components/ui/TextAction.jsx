/**
 * TextAction — inline dark-green text link, min 44px tap target.
 * Design: "Text action" — 12px black #405c04.
 */
export default function TextAction({ as: Tag = 'button', className = '', children, ...props }) {
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      className={`inline-flex min-h-11 items-center text-[12px] leading-[normal] font-black whitespace-nowrap text-[#405c04] hover:underline ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}