import { Users } from 'lucide-react'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'

export default function YourCommunity() {
  return (
    <section className="flex w-full min-w-0 flex-col gap-[18px]">
      <SectionHeading title="Your Community" className="lg:h-[58px] lg:items-end" />

      <Card className="flex min-h-[344px] w-full flex-1 flex-col gap-[18px] p-6">
        <div className="flex w-full items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center border border-solid border-[#171916] bg-[#d5f35b]">
            <Users size={22} strokeWidth={1.7} className="text-[#171916]" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-[15px] font-extrabold text-[#171916]">CS Study Circle</p>
            <p className="text-[11px] leading-[1.5] font-normal text-[#62665c]">
              University learning community
            </p>
          </div>
        </div>

        <p className="text-[20px] leading-[1.14] font-bold text-[#171916] lg:text-[26px]">
          “How do you approach normalization?”
        </p>
        <p className="text-[11px] leading-[1.5] font-normal text-[#62665c]">
          Maya · Discussion · 3 new replies
        </p>
        <p className="text-[12px] leading-[1.5] font-normal text-[#62665c]">
          Also shared: a database revision path.
        </p>

        <TextAction className="self-start">Open community →</TextAction>
      </Card>
    </section>
  )
}