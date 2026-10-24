import Button from '../ui/Button.jsx'

/**
 * UploadMaterialEmptyState — "Upload Material" empty card.
 * White card, 2px ink outline, 8px radius, centred title + copy + compact
 * primary CTA (lime, size="sm").
 *
 * NOTE: the design copy reads "No content uploded yet" (typo); corrected here.
 */
export default function UploadMaterialEmptyState({ onUpload, uploading = false }) {
  return (
    <div className="flex w-full flex-col rounded-[8px] border-2 border-solid border-[#171916] bg-white p-5">
      <div className="flex w-full flex-col items-center gap-5">
        <p className="text-center text-[13px] leading-[1.5] font-black text-[#171916]">
          No content uploaded yet
        </p>
        {/* Copy is constrained to 212px on mobile (3 lines) and
            373px from 768px up (2 lines). */}
        <p className="w-[212px] max-w-full text-center text-[11px] leading-[1.5] font-medium text-[#62665c] md:w-[373px]">
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