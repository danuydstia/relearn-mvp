/**
 * KpiCard — admin metric card (design node 10:62513).
 * 216×128 in the 1144 grid: 16px padding, 12px radius, three stacked rows.
 */
export default function KpiCard({ label, value, detail, icon: Icon }) {
  return (
    <div className="flex h-[128px] min-w-0 flex-1 flex-col gap-2 overflow-hidden rounded-[12px] border border-[#dad9d4] bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <p className="text-[11px] leading-[1.5] text-[#686b73]">{label}</p>
        <Icon size={16} strokeWidth={1.75} className="shrink-0 text-[#686b73]" aria-hidden="true" />
      </div>
      <p className="text-[25px] leading-[1.5] font-bold whitespace-nowrap text-[#17191f]">{value}</p>
      <p className="w-full text-[10px] leading-[1.5] text-[#686b73]">{detail}</p>
    </div>
  )
}
