/**
 * Panel — the learning screens' 12px white card with the design-system
 * "border/subtle" (#deded9) outline. The dashboard's Card is one token older
 * (#dad9d4), so these screens keep their own surface rather than changing every
 * existing card.
 */
export default function Panel({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-[12px] bg-white -outline-offset-1 outline outline-1 outline-solid outline-[#deded9] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
