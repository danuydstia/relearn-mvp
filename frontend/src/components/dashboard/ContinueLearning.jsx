import { Link } from 'react-router-dom'
import { Brain, Database } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'
import ProgressTrack from '../ui/ProgressTrack.jsx'
import { learningPathUrl, moduleUrl } from '../../lib/learningPath'

/**
 * ContinueLearning — design nodes 2:7975 (heading), 2:7980 + 2:8004 (cards);
 * mobile 2:6364 with cards 2:6369 + 2:6392.
 *
 * The heading's action shortens from "My Learning →" to "View all" on mobile.
 *
 * The two path cards keep the same internal rhythm at every width (16px between
 * blocks, p-6), but their footers reflow below 768px:
 * - The featured card moves its activity stamp out of the label row and above a
 *   full-width primary button ("Last activity · Yesterday"), replacing the
 *   desktop's helper line + right-aligned button.
 * - The compact card abandons its horizontal icon/title/button row entirely and
 *   becomes a vertical card with a PSYCHOLOGY subject label — identical in
 *   shape to the featured one, minus the "Next ·" line and with a secondary CTA.
 */

function SubjectLabel({ icon: Icon, label }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Icon size={20} strokeWidth={1.75} className="shrink-0 text-[#0033ff]" aria-hidden="true" />
      <p className="text-[11px] leading-[normal] font-medium whitespace-nowrap text-[#0033ff]">
        {label}
      </p>
    </div>
  )
}

function PathDetails({ title, source, titleSize = 22 }) {
  const titleClass = titleSize === 17 ? 'text-[17px]' : 'text-[22px]'
  return (
    <div className="flex w-full flex-col gap-1.5 leading-[1.5]">
      <p className={`font-semibold text-[#17191f] ${titleClass}`}>{title}</p>
      <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">{source}</p>
    </div>
  )
}

function TopicBlock({ topic, next }) {
  return (
    <div className="flex w-full flex-col gap-1 leading-[1.5]">
      <p className="text-[11px] font-normal text-[#686b73]">CURRENT TOPIC</p>
      <p className="text-[14px] font-medium text-[#17191f]">{topic}</p>
      {next && <p className="text-[12px] font-normal text-[#686b73]">{next}</p>}
    </div>
  )
}

function ProgressBlock({ value, label }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-start justify-between text-[12px] leading-[normal] whitespace-nowrap">
        <p className="font-normal text-[#686b73]">Path progress</p>
        <p className="font-medium text-[#17191f]">{label}</p>
      </div>
      <ProgressTrack value={value} />
    </div>
  )
}

/** Mobile footer: the activity stamp sits above a full-width CTA. */
function StackedAction({ activity, variant, to }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">{activity}</p>
      <Button as={to ? Link : 'button'} to={to} variant={variant} className="w-full">
        Continue →
      </Button>
    </div>
  )
}

export default function ContinueLearning() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading
        title="Continue Learning"
        action={
          <TextAction as={Link} to={learningPathUrl()}>
            <span className="md:hidden">View all</span>
            <span className="hidden md:inline">My Learning →</span>
          </TextAction>
        }
      />

      {/* ── Featured learning path ── */}
      {/* Mobile (2:6369) */}
      <Card className="flex w-full flex-col gap-4 p-6 md:hidden">
        <SubjectLabel icon={Database} label="COMPUTER SCIENCE" />
        <PathDetails
          title="Introduction to Database Systems"
          source="Source · Database Systems — Lecture 04.pdf"
        />
        <TopicBlock
          topic="Relational Database Design"
          next="Next · Functional dependencies"
        />
        <ProgressBlock value={50} label="4 of 8 topics" />
        <StackedAction activity="Last activity · Yesterday" to={moduleUrl()} />
      </Card>

      {/* Tablet + desktop (2:7980) */}
      <Card className="hidden w-full flex-col gap-4 p-6 md:flex">
        <div className="flex w-full items-center justify-between">
          <SubjectLabel icon={Database} label="COMPUTER SCIENCE" />
          <p className="text-[11px] leading-[normal] font-normal whitespace-nowrap text-[#686b73]">
            Yesterday
          </p>
        </div>
        <PathDetails
          title="Introduction to Database Systems"
          source="Source · Database Systems — Lecture 04.pdf"
        />
        <TopicBlock
          topic="Relational Database Design"
          next="Next · Functional dependencies"
        />
        <ProgressBlock value={50} label="4 of 8 topics" />
        <div className="flex w-full items-center gap-3">
          <p className="min-w-px flex-1 text-[11px] leading-[1.5] font-normal text-[#686b73]">
            Continue from your last topic.
          </p>
          <Button as={Link} to={moduleUrl()} className="shrink-0">
            Continue →
          </Button>
        </div>
      </Card>

      {/* ── Compact learning path ── */}
      {/* Mobile (2:6392) */}
      <Card className="flex w-full flex-col gap-4 p-6 md:hidden">
        <SubjectLabel icon={Brain} label="PSYCHOLOGY" />
        <PathDetails
          title="Cognitive Psychology"
          source="Source · Memory and Learning.docx"
          titleSize={17}
        />
        <TopicBlock topic="Working Memory" />
        <ProgressBlock value={33.33} label="2 of 6 topics" />
        <StackedAction activity="Last activity · 2 days ago" variant="secondary" />
      </Card>

      {/* Tablet + desktop (2:8004) */}
      <Card className="hidden w-full flex-col gap-4 p-6 md:flex">
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

        <ProgressBlock value={33.33} label="2 of 6 topics" />
      </Card>
    </section>
  )
}
