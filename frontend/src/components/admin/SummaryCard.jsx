/**
 * SummaryCard — one account metric on the admin Users screen (design 10:62770).
 *
 * 274×64 in the 1144 grid: the label sits left, the figure right, both centred.
 * Deliberately flatter than KpiCard, which is the Overview's three-row tile.
 */
export default function SummaryCard({ label, value }) {
  return (
    <div className="flex h-[64px] min-w-0 flex-1 items-center justify-between gap-4 overflow-hidden rounded-[12px] border border-[#dad9d4] bg-white px-4">
      <p className="text-[11px] leading-[1.5] text-[#686b73]">{label}</p>
      <p className="text-[20px] leading-[30px] font-bold whitespace-nowrap text-[#17191f]">
        {value}
      </p>
    </div>
  )
}
