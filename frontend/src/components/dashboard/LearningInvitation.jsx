import Button from '../ui/Button.jsx'

/**
 * LearningInvitation — design node 2:7964.
 * Eyebrow + 36px heading + supporting line, with the primary CTA on the right.
 */
export default function LearningInvitation({ onNewSession }) {
  return (
    <section className="flex w-full items-center gap-6 py-2">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-[10px] leading-[normal] font-medium whitespace-nowrap text-[#0033ff]">
          YOUR LEARNING, IN MOTION
        </p>
        <p className="text-[36px] leading-[1.18] font-semibold text-[#17191f]">
          What will you learn today?
        </p>
        <p className="text-[14px] leading-[1.5] font-normal text-[#686b73]">
          Pick up where you left off, or start with something new.
        </p>
      </div>

      <div className="flex w-[248px] shrink-0 flex-col items-center gap-2">
        <Button className="w-full" onClick={onNewSession}>
          + New Learning Session
        </Button>
        <p className="text-[11px] leading-[normal] font-normal whitespace-nowrap text-[#686b73]">
          PDF, DOCX or PPTX
        </p>
      </div>
    </section>
  )
}
