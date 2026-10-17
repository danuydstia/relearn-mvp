import Button from '../ui/Button.jsx'

/**
 * LearningInvitation — design node 2:7964 (desktop), 2:6355 (mobile).
 * Desktop/tablet: eyebrow + 36px heading + supporting line, primary CTA (248px)
 *   on the right, vertically centred. Total height 115.
 * Mobile: the CTA drops below the copy and fills the width, and the heading
 *   steps down to 30px. Total height 257.
 */
export default function LearningInvitation({ onNewSession }) {
  return (
    <section className="flex w-full flex-col gap-6 py-2 md:flex-row md:items-center">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-[10px] leading-[normal] font-medium whitespace-nowrap text-[#0033ff]">
          YOUR LEARNING, IN MOTION
        </p>
        <p className="text-[30px] leading-[1.18] font-semibold text-[#17191f] md:text-[36px]">
          What will you learn today?
        </p>
        <p className="text-[14px] leading-[1.5] font-normal text-[#686b73]">
          Pick up where you left off, or start with something new.
        </p>
      </div>

      <div className="flex w-full shrink-0 flex-col items-center gap-2 md:w-[248px]">
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
