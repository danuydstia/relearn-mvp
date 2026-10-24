/**
 * Button — primary / secondary / ghost.
 * Neo-brutalist: 2px #171916 border, radius 8.
 *   primary   — lime fill, ink label
 *   secondary — white fill, ink label
 *   ghost     — transparent, dark-green label
 *   size="md" → h 46, px 18, 12px bold  (CTA di kartu)
 *   size="sm" → h 38, px 15, 13px black (aksi kompak)
 */
const VARIANTS = {
  primary: 'bg-[#d5f35b] border-[#171916] text-[#171916] hover:bg-[#c8e84a]',
  secondary: 'bg-white border-[#171916] text-[#171916] hover:bg-[#f2f1ec]',
  ghost: 'bg-transparent border-transparent text-[#405c04] hover:bg-[#f2f1ec]',
}

const DISABLED =
  'disabled:cursor-not-allowed disabled:border-[#e4e3df] disabled:bg-[#e4e3df] disabled:text-[#777a82] disabled:hover:border-[#e4e3df] disabled:hover:bg-[#e4e3df]'

const SIZES = {
  md: 'h-[46px] px-[18px] text-[12px] font-bold',
  sm: 'h-[38px] px-[15px] text-[13px] font-black',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-solid whitespace-nowrap transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916] ${
        SIZES[size] ?? SIZES.md
      } ${VARIANTS[variant] ?? VARIANTS.primary} ${DISABLED} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </Tag>
  )
}