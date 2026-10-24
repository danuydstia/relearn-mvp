import { NavLink } from 'react-router-dom'
import { FileUp } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../contexts/AuthContext'

/**
 * LearningInvitation — hero.
 * Kiri: eyebrow, heading besar (78px di desktop lebar), supporting line.
 * Kanan (410px): kartu lime berisi CTA upload dan blok AI usage.
 * Di bawah 1024px kartu turun di bawah teks dan memenuhi lebar.
 */
export default function LearningInvitation({ onNewSession }) {
  const { user } = useAuth()
  const isPro = user?.plan === 'pro'

  return (
    <section className="flex w-full flex-col gap-8 py-2 lg:flex-row lg:items-center lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="text-[10px] leading-[1.4] font-black text-[#62665c]">
          DASHBOARD / YOUR LEARNING, IN MOTION
        </p>
        <h1 className="text-[44px] leading-[0.98] font-black text-[#171916] md:text-[60px] xl:text-[78px]">
          What will you learn today?
        </h1>
        <p className="text-[15px] leading-[1.5] font-normal text-[#62665c]">
          Pick up where you left off, or start with something new.
        </p>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-[14px] rounded-[8px] border-2 border-solid border-[#171916] bg-[#d5f35b] p-6 lg:w-[410px]">
        <div className="flex w-full items-center justify-between">
          <FileUp size={40} strokeWidth={1.5} className="text-[#171916]" aria-hidden="true" />
          <p className="text-[11px] font-black text-[#171916]">PDF, DOCX or PPTX</p>
        </div>

        <Button variant="secondary" className="self-start" onClick={onNewSession}>
          + New Learning Session
        </Button>

        <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-t border-solid border-[#171916] pt-3">
          <p className="text-[11px] font-bold text-black">AI usage · {isPro ? 'Pro' : 'Free'}</p>
          <p className="text-[10px] font-normal text-[#405c04]">Usage details will appear here.</p>
          {!isPro && (
            <NavLink to="/pro" className="text-[10px] font-black text-[#171916] hover:underline">
              Explore Pro →
            </NavLink>
          )}
        </div>
      </div>
    </section>
  )
}