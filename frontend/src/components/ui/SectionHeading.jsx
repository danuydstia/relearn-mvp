/**
 * SectionHeading — dashboard section title (20px semibold) with an
 * optional right-aligned action. Design: "Section heading" 2:7976.
 */
export default function SectionHeading({ title, action }) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="text-[20px] leading-[normal] font-semibold text-[#17191f]">{title}</h2>
      {action}
    </div>
  )
}
