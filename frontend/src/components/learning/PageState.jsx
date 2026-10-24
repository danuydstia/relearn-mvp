import { Link } from 'react-router-dom'
import { BookOpen, CircleAlert } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

/**
 * PageState — tiga state halaman learning: Loading, Empty, Error.
 * Label "State=Loading" dst di Figma hanyalah penanda varian, bukan UI,
 * jadi tidak dirender.
 */

/** Loading: caption + kartu skeleton (24 / 12 / 84 / 84 / 84). */
export function LoadingState({ label = 'Loading…' }) {
  return (
    <div role="status" aria-live="polite" className="flex w-full flex-col gap-6">
      <p className="text-[13px] leading-[1.5] font-black text-[#62665c]">{label}</p>
      <Card className="flex w-full flex-col gap-4 p-5" aria-hidden="true">
        <div className="h-6 w-full animate-pulse rounded-[6px] bg-[#f7f7f2]" />
        <div className="h-3 w-full animate-pulse rounded-[6px] bg-[#f7f7f2]" />
        <div className="h-[84px] w-full animate-pulse rounded-[6px] bg-[#f7f7f2]" />
        <div className="h-[84px] w-full animate-pulse rounded-[6px] bg-[#f7f7f2]" />
        <div className="h-[84px] w-full animate-pulse rounded-[6px] bg-[#f7f7f2]" />
      </Card>
    </div>
  )
}

/** Empty: ikon lime, judul, deskripsi, satu aksi (link atau tombol). */
export function EmptyState({ title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex w-full max-w-[480px] flex-col gap-6">
      <Card className="flex w-full flex-col gap-4 p-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-[#d5f35b]">
          <BookOpen size={24} strokeWidth={1.7} className="text-[#171916]" aria-hidden="true" />
        </span>
        <p className="text-[16px] leading-[1.5] font-black text-[#17191f]">{title}</p>
        <p className="text-[13px] leading-[1.5] font-medium text-[#686b73]">{description}</p>
      </Card>
      {actionLabel &&
        (actionTo ? (
          <Button as={Link} to={actionTo} className="w-full">
            {actionLabel}
          </Button>
        ) : (
          <Button onClick={onAction} className="w-full">
            {actionLabel}
          </Button>
        ))}
    </div>
  )
}

/** Error: kartu merah muda, tombol retry, catatan data aman. */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  note = 'Your existing learning data has not been removed.',
}) {
  return (
    <div role="alert" className="flex w-full max-w-[480px] flex-col gap-5">
      <div className="flex w-full items-start gap-3 rounded-[8px] border-2 border-solid border-[#171916] bg-[#fff5f2] p-5">
        <CircleAlert size={20} strokeWidth={1.7} className="mt-px shrink-0 text-[#a53932]" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
          <p className="text-[13px] leading-[1.5] font-black text-[#17191f]">{title}</p>
          <p className="text-[11px] leading-[1.5] font-medium text-[#686b73]">{description}</p>
        </div>
      </div>
      <Button onClick={onRetry} className="w-full">
        {retryLabel}
      </Button>
      {note && <p className="text-[11px] leading-[1.5] font-medium text-[#62665c]">{note}</p>}
    </div>
  )
}