import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

/**
 * ProfileOverviewCard — "Learning overview" (design 60:9086).
 *
 * The same Performance summary the dashboard uses (design node 2:6047), with
 * the evaluated-topics metric and the trailing trend / snapshot / "View
 * performance" rows not shown on this screen. Score and metrics are the
 * dashboard's staged example data.
 */
export default function ProfileOverviewCard() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Learning overview" />

      <Card className="flex w-full flex-col gap-4 p-5 md:p-6">
        <div className="flex w-full flex-col gap-1">
          <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
            Latest quiz · SQL Fundamentals
          </p>
          <p className="text-[36px] leading-[normal] font-semibold text-[#17191f]">
            80<span className="text-[23px]">%</span>
          </p>
          <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
            8 of 10 questions correct
          </p>
        </div>

        <div className="h-px w-full shrink-0 bg-[#dad9d4]" />

        <div className="flex w-full items-start gap-5 leading-[1.5]">
          <div className="flex min-w-px flex-1 flex-col gap-1">
            <p className="text-[23px] font-semibold text-[#17191f]">6</p>
            <p className="text-[11px] font-normal text-[#686b73]">Quizzes completed</p>
          </div>
        </div>
      </Card>
    </section>
  )
}
