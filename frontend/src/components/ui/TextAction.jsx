/**
 * TextAction — inline blue text link, min 44px tap target.
 * Design: "Text action" — 12px medium #03f.
 */
export default function TextAction({ as: Tag = 'button', className = '', children, ...props }) {
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      className={`inline-flex min-h-11 items-center text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#0033ff] hover:underline ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
