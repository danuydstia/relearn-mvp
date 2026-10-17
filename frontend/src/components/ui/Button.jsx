/**
 * Button — primary / secondary / ghost.
 * Design: Primary CTA — bg #03f, border #03f, radius 10, 13px semibold.
 *   Secondary CTA — white bg, #dad9d4 border, **blue** #03f label.
 *   size="md" → h 48, px 20  (invitation, card actions)
 *   size="sm" → h 38, px 15  (compact actions, e.g. "+ Input Your Material")
 */
const VARIANTS = {
  primary:
    'bg-[#0033ff] border-[#0033ff] text-white hover:bg-[#2652ff] hover:border-[#2652ff]',
  secondary:
    'bg-white border-[#dad9d4] text-[#0033ff] hover:bg-[#f5f5f2] hover:border-[#c8c7c2]',
  ghost: 'bg-transparent border-transparent text-[#0033ff] hover:bg-[#eef1ff]',
}

const SIZES = {
  md: 'h-[48px] px-[20px]',
  sm: 'h-[38px] px-[15px]',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] border border-solid text-[13px] font-semibold whitespace-nowrap transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${
        SIZES[size] ?? SIZES.md
      } ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
