import Button from '../ui/Button.jsx'

/**
 * UploadMaterialEmptyState — design node 91:4710 / 91:4712 ("Upload Material").
 * White card, 172px tall, centred title + copy + compact primary CTA.
 *
 * NOTE: the design copy reads "No content uploded yet" (typo); corrected here.
 */
export default function UploadMaterialEmptyState({ onUpload, uploading = false }) {
  return (
    <div className="flex w-full flex-col rounded-[12px] border border-solid border-[#dad9d4] bg-white p-5">
      <div className="flex w-full flex-col items-center gap-5">
        <p className="text-center text-[13px] leading-[1.5] font-semibold text-[#17191f]">
          No content uploaded yet
        </p>
        {/* Copy is constrained to 212px on mobile (3 lines, design 2:6666) and
            373px from 768px up (2 lines, design 91:4714). */}
        <p className="w-[212px] max-w-full text-center text-[11px] leading-[1.5] font-normal text-[#686b73] md:w-[373px]">
          Start by uploading your first learning material. The AI will assist you according to your
          preferences.
        </p>
        <Button size="sm" onClick={onUpload} loading={uploading} disabled={uploading}>
          {uploading ? 'Uploading…' : '+ Input Your Material'}
        </Button>
      </div>
    </div>
  )
}
