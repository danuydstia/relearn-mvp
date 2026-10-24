/**
 * Card — white surface, 2px ink outline, 8px radius.
 * Design: Learning cards / supporting components.
 *
 * The 2px line is an inset outline rather than a border, same as in Figma
 * (outlineOffset -2px). Figma strokes are centred on the frame edge, so the
 * design's padding measures from the frame's full width. A real border is
 * inside the border-box and would eat pixels on each side.
 */
export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-[8px] bg-white -outline-offset-2 outline outline-2 outline-solid outline-[#171916] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}