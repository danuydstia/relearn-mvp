/**
 * Card — white surface, 1px line border, 12px radius.
 * Design: Learning cards / supporting components.
 */
export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-[12px] border border-solid border-[#dad9d4] bg-white ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
