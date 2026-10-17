/**
 * PlaceholderPage — used by sidebar destinations that have no design yet.
 * Communicates clearly that the screen is pending design rather than 404-ing.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <div className="flex w-full flex-col gap-4 px-6 pt-7 pb-8 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <h1 className="text-[28px] leading-[normal] font-semibold text-[#17191f]">{title}</h1>
      {description && (
        <p className="max-w-[640px] text-[14px] leading-[1.5] font-normal text-[#686b73]">{description}</p>
      )}
      <div className="mt-4 flex w-full items-center justify-center rounded-[12px] border border-dashed border-[#dad9d4] bg-white py-20">
        <p className="text-[13px] font-medium text-[#8a8d94]">This screen hasn’t been designed yet.</p>
      </div>
    </div>
  )
}
