import { Link } from 'react-router-dom'
import { Brain, Database } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'
import SegmentedProgress from '../ui/SegmentedProgress.jsx'
import { learningPathUrl, moduleUrl } from '../../lib/learningPath'

/**
 * ContinueLearning — dua kartu: featured (putih, lebar) + compact (hitam, sempit).
 * Desktop (≥1024px): kolom 808 : 252. Di bawah itu menumpuk satu kolom.
 * Action heading memendek dari "My Learning →" jadi "View all" di mobile.
 */
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

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,808fr)_minmax(0,252fr)]">
        {/* ── Featured (putih) ── */}
        <Card className="flex w-full flex-col gap-5 p-[26px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={18} strokeWidth={1.75} className="shrink-0 text-[#171916]" aria-hidden="true" />
              <p className="text-[10px] leading-[1.4] font-black whitespace-nowrap text-[#62665c]">
                COMPUTER SCIENCE
              </p>
            </div>
            <p className="text-[10px] leading-[1.4] font-black whitespace-nowrap text-[#62665c]">
              Yesterday
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <p className="text-[26px] leading-[1.08] font-extrabold text-[#171916] md:text-[34px]">
              Introduction to Database Systems
            </p>
            <p className="text-[12px] leading-[1.5] font-normal text-[#62665c]">
              Source · Database Systems — Lecture 04.pdf
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 border-y border-solid border-[#171916] py-4 md:flex-row md:items-center md:gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-[10px] leading-[1.4] font-black text-[#62665c]">CURRENT TOPIC</p>
              <p className="text-[18px] font-bold text-[#171916]">Relational Database Design</p>
              <p className="text-[12px] leading-[1.5] font-normal text-[#62665c]">
                Next · Functional dependencies
              </p>
            </div>
            <Button as={Link} to={moduleUrl()} className="shrink-0">
              Continue →
            </Button>
          </div>

          <div className="flex w-full flex-col gap-[9px]">
            <div className="flex w-full items-start justify-between">
              <p className="text-[10px] font-black text-[#62665c]">Path progress</p>
              <p className="text-[11px] font-black text-[#171916]">4 of 8 topics</p>
            </div>
            <SegmentedProgress done={4} total={8} />
          </div>

          <p className="text-[11px] leading-[1.5] font-normal text-[#62665c]">
            Continue from your last topic.
          </p>
        </Card>

        {/* ── Compact (hitam) ── */}
        <div className="flex w-full flex-col gap-5 rounded-[4px] border-2 border-solid border-[#171916] bg-[#171916] p-[26px]">
          <div className="flex w-full items-center justify-between">
            <Brain size={22} strokeWidth={1.7} className="shrink-0 text-[#d5f35b]" aria-hidden="true" />
            <p className="text-[10px] leading-[1.4] font-black text-[#bcc0b5]">2 days ago</p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <p className="text-[28px] leading-[1.1] font-extrabold text-white lg:text-[32px]">
              Cognitive Psychology
            </p>
            <p className="text-[12px] leading-[1.5] font-normal text-[#bcc0b5]">
              Source · Memory and Learning.docx
            </p>
          </div>

          <div className="flex w-full flex-col gap-[7px] py-[15px]">
            <p className="text-[10px] leading-[1.4] font-black text-[#bcc0b5]">Current topic</p>
            <p className="text-[20px] font-semibold text-white">Working Memory</p>
          </div>

          <div className="flex w-full flex-col gap-[9px]">
            <div className="flex w-full items-start justify-between">
              <p className="text-[10px] font-black text-[#bcc0b5]">Path progress</p>
              <p className="text-[11px] font-black text-white">2 of 6 topics</p>
            </div>
            <SegmentedProgress done={2} total={6} tone="dark" />
          </div>

          <Button variant="secondary" className="self-start">
            Continue →
          </Button>
        </div>
      </div>
    </section>
  )
}