import { Users } from 'lucide-react'
import Card from '../ui/Card.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'

/**
 * YourCommunity — design nodes 2:8108 (heading), 2:8111 (community card).
 */
export default function YourCommunity() {
  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading title="Your Community" />

      <Card className="flex w-full flex-col gap-4 p-6">
        <div className="flex w-full items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-[#f2f1ec]">
            <Users size={20} strokeWidth={1.75} className="text-[#0033ff]" aria-hidden="true" />
          </span>
          <div className="flex min-w-px flex-1 flex-col gap-1 leading-[1.5]">
            <p className="text-[14px] font-semibold text-[#17191f]">CS Study Circle</p>
            <p className="text-[11px] font-normal text-[#686b73]">University learning community</p>
          </div>
        </div>

        <p className="text-[13px] leading-[1.5] font-medium text-[#17191f]">
          “How do you approach normalization?”
        </p>
        <p className="text-[11px] leading-[1.5] font-normal text-[#686b73]">
          Maya · Discussion · 3 new replies
        </p>
        <p className="text-[12px] leading-[1.5] font-normal text-[#686b73]">
          Also shared: a database revision path.
        </p>

        <TextAction>Open community →</TextAction>
      </Card>
    </section>
  )
}
