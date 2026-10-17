/**
 * Card — white surface, 1px line border, 12px radius.
 * Design: Learning cards / supporting components.
 *
 * The 1px line is an inset outline rather than a border. Figma strokes are
 * centred on the frame edge, so the design's padding measures from the frame's
 * full width — a 327px card has 287px of inner content at p-5, not 285. A real
 * border is inside the border-box and would eat a pixel on each side.
 */
export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-[12px] bg-white -outline-offset-1 outline outline-1 outline-solid outline-[#dad9d4] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
