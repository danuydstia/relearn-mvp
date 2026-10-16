import { Brain, Database } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'
import ProgressTrack from '../ui/ProgressTrack.jsx'

/**
 * ContinueLearning — design nodes 2:7975 (heading), 2:7980 + 2:8004 (cards).
 * Two learning-path cards: a featured resume card and a compact one.
 */
export default function ContinueLearning() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Continue Learning" action={<TextAction>My Learning →</TextAction>} />

      {/* Featured learning path */}
      <Card className="flex w-full flex-col gap-4 p-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex shrink-0 items-center gap-2">
            <Database size={20} strokeWidth={1.75} className="shrink-0 text-[#0033ff]" aria-hidden="true" />
            <p className="text-[11px] leading-[normal] font-medium whitespace-nowrap text-[#0033ff]">
              COMPUTER SCIENCE
            </p>
          </div>
          <p className="text-[11px] leading-[normal] font-normal whitespace-nowrap text-[#686b73]">
            Yesterday
          </p>
        </div>

        <div className="flex w-full flex-col gap-1.5 leading-[1.5]">
          <p className="text-[22px] font-semibold text-[#17191f]">Introduction to Database Systems</p>
          <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
            Source · Database Systems — Lecture 04.pdf
          </p>
        </div>

        <div className="flex w-full flex-col gap-1 leading-[1.5]">
          <p className="text-[11px] font-normal text-[#686b73]">CURRENT TOPIC</p>
          <p className="text-[14px] font-medium text-[#17191f]">Relational Database Design</p>
          <p className="text-[12px] font-normal text-[#686b73]">Next · Functional dependencies</p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between text-[12px] leading-[normal] whitespace-nowrap">
            <p className="font-normal text-[#686b73]">Path progress</p>
            <p className="font-medium text-[#17191f]">4 of 8 topics</p>
          </div>
          <ProgressTrack value={50} />
        </div>

        <div className="flex w-full items-center gap-3">
          <p className="min-w-px flex-1 text-[11px] leading-[1.5] font-normal text-[#686b73]">
            Continue from your last topic.
          </p>
          <Button className="shrink-0">Continue →</Button>
        </div>
      </Card>

      {/* Compact learning path */}
      <Card className="flex w-full flex-col gap-4 p-6">
        <div className="flex w-full items-center gap-4">
          <Brain size={20} strokeWidth={1.75} className="shrink-0 text-[#17191f]" aria-hidden="true" />
          <div className="flex min-w-px flex-1 flex-col gap-1 leading-[1.5]">
            <p className="text-[17px] font-semibold text-[#17191f]">Cognitive Psychology</p>
            <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
              Source · Memory and Learning.docx
            </p>
          </div>
          <Button variant="secondary" className="shrink-0">
            Continue →
          </Button>
        </div>

        <div className="flex w-full items-center justify-between">
          <p className="min-w-px flex-1 text-[13px] leading-[1.5] font-normal text-[#17191f]">
            Current topic · Working Memory
          </p>
          <p className="text-[11px] leading-[normal] font-normal whitespace-nowrap text-[#686b73]">
            2 days ago
          </p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between text-[12px] leading-[normal] whitespace-nowrap">
            <p className="font-normal text-[#686b73]">Path progress</p>
            <p className="font-medium text-[#17191f]">2 of 6 topics</p>
          </div>
          <ProgressTrack value={33.33} />
        </div>
      </Card>
    </section>
  )
}
