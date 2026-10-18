/**
 * AdminUnavailablePage — placeholder for admin destinations that are designed
 * but not built yet. It sits inside the admin shell so the sidebar keeps working
 * and nothing dead-ends.
 */
export default function AdminUnavailablePage({ title }) {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="flex w-full max-w-[460px] flex-col rounded-[12px] border border-[#dad9d4] bg-white p-8">
        <p className="text-[10px] font-medium uppercase text-[#686b73]">Not available yet</p>
        <h1 className="mt-2 text-[20px] font-bold text-[#17191f]">{title}</h1>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#686b73]">
          This screen is designed and waiting on its data. Overview is the only page wired up so
          far.
        </p>
      </div>
    </div>
  )
}
