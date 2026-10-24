import { Link } from 'react-router-dom'
import { FileText, Folder, Pencil, Trash2 } from 'lucide-react'
import Card from '../ui/Card.jsx'
import { subjectUrl } from '../../lib/subjects'

/**
 * SubjectCard — kartu subject di grid Materials (padding 20, gap 13).
 * Seluruh kartu bisa diklik lewat link judul (stretched link); tombol edit dan
 * hapus ada di atasnya (z-10) supaya tidak ikut membuka halaman detail.
 */
const ICON_BUTTON =
  'flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-[#62665c] transition-colors hover:text-[#171916] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#171916]'

export default function SubjectCard({ subject, onEdit, onDelete }) {
  const count = subject.notes.length

  return (
    <Card className="relative flex w-full flex-col gap-[13px] p-5 transition-transform hover:-translate-y-px">
      <div className="flex w-full items-start justify-between">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-solid border-[#171916] bg-[#d5f35b]">
          <Folder size={18} strokeWidth={1.7} className="text-[#171916]" aria-hidden="true" />
        </span>

        <div className="relative z-10 -mt-1.5 -mr-1.5 flex items-center">
          <button
            type="button"
            onClick={() => onEdit?.(subject)}
            aria-label={`Edit ${subject.title}`}
            className={ICON_BUTTON}
          >
            <Pencil size={17} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(subject)}
            aria-label={`Delete ${subject.title}`}
            className={ICON_BUTTON}
          >
            <Trash2 size={17} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Link
        to={subjectUrl(subject.slug)}
        className="text-[16px] leading-[1.5] font-black text-[#171916] after:absolute after:inset-0 after:content-[''] hover:underline"
      >
        {subject.title}
      </Link>

      <div className="flex items-center gap-1.5">
        <FileText size={14} strokeWidth={1.7} className="shrink-0 text-[#62665c]" aria-hidden="true" />
        <p className="text-[12px] leading-[1.5] font-bold text-[#62665c]">
          {count} {count === 1 ? 'Note' : 'Notes'}
        </p>
      </div>
    </Card>
  )
}