/**
 * SectionHeading — judul section dashboard (24px extrabold) + action opsional.
 * `className` dipakai untuk menyamakan tinggi heading antar kolom.
 */
export default function SectionHeading({ title, action, className = '' }) {
  return (
    <div className={`flex w-full items-center justify-between ${className}`}>
      <h2 className="text-[24px] leading-[1.2] font-extrabold text-[#171916]">{title}</h2>
      {action}
    </div>
  )
}