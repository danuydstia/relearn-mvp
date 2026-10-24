import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination — tombol bulat 38px. Halaman aktif lime, prev/next redup (50%)
 * kalau tidak bisa dipakai. Teks ringkasan memakai bahasa Indonesia, sesuai desain.
 */
const BASE =
  'flex size-[38px] shrink-0 items-center justify-center rounded-full border-2 border-solid border-[#171916] text-[14px] font-black text-[#171916] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]'

export default function Pagination({ page, pageCount, from, to, total, onPageChange, className = '' }) {
  return (
    <nav aria-label="Pagination" className={`flex w-full flex-col items-center gap-[10px] ${className}`}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${BASE} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ChevronLeft size={16} strokeWidth={1.7} className="text-[#62665c]" aria-hidden="true" />
        </button>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`Page ${n}`}
            aria-current={n === page ? 'page' : undefined}
            onClick={() => onPageChange(n)}
            className={`${BASE} cursor-pointer ${n === page ? 'bg-[#d5f35b]' : 'bg-transparent hover:bg-[#d5f35b]/40'}`}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={`${BASE} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ChevronRight size={16} strokeWidth={1.7} className="text-[#62665c]" aria-hidden="true" />
        </button>
      </div>

      <p className="text-[12px] font-bold text-[#62665c]">
        Menampilkan {from}-{to} dari {total}
      </p>
    </nav>
  )
}