import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * TablePagination — the account list's page controls (design 10:62689).
 *
 * The design shows "‹ 1 2 3 … ›": a three-wide window around the current page
 * with an ellipsis wherever the window does not reach an end.
 */
const PER_PAGE_OPTIONS = [10, 25, 50]

const format = (value) => new Intl.NumberFormat('en-US').format(value)

function pageWindow(current, last) {
  if (last <= 3) return Array.from({ length: last }, (_, index) => index + 1)

  const start = Math.min(Math.max(1, current - 1), last - 2)
  return [start, start + 1, start + 2]
}

function PagerButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-[6px] border border-[#dad9d4] bg-white text-[#686b73] disabled:opacity-40"
    >
      {children}
    </button>
  )
}

export default function TablePagination({ meta, perPage, onPerPageChange, onPageChange }) {
  const pageCount = Math.max(meta.last_page ?? 1, 1)
  const pages = pageWindow(meta.page, pageCount)
  const showLeading = pages.length > 0 && pages[0] > 1
  const showTrailing = pages.length > 0 && pages[pages.length - 1] < pageCount

  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-[11px] leading-[1.5] text-[#686b73]">
        {meta.total === 0
          ? 'No accounts to show'
          : `${format(meta.from)}–${format(meta.to)} of ${format(meta.total)} users`}
      </p>

      <div className="flex shrink-0 items-center gap-3">
        <div className="relative flex h-8 items-center rounded-[6px] border border-[#dad9d4] bg-white pl-3">
          <select
            aria-label="Rows per page"
            value={perPage}
            onChange={(event) => onPerPageChange(Number(event.target.value))}
            className="h-full appearance-none bg-transparent pr-7 text-[11px] leading-[1.5] whitespace-nowrap text-[#17191f] outline-none"
          >
            {PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2 shrink-0 text-[#686b73]"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center gap-1">
          <PagerButton
            label="Previous page"
            disabled={meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
          >
            <ChevronLeft size={14} aria-hidden="true" />
          </PagerButton>

          {showLeading && (
            <span className="flex size-8 items-center justify-center text-[11px] text-[#686b73]">
              …
            </span>
          )}

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              aria-current={page === meta.page ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={`flex size-8 items-center justify-center rounded-[6px] text-[11px] leading-[1.5] font-medium ${
                page === meta.page
                  ? 'bg-[#f2f1ec] text-[#17191f]'
                  : 'text-[#686b73] hover:bg-[#f8f7f3]'
              }`}
            >
              {page}
            </button>
          ))}

          {showTrailing && (
            <span className="flex size-8 items-center justify-center text-[11px] text-[#686b73]">
              …
            </span>
          )}

          <PagerButton
            label="Next page"
            disabled={meta.page >= pageCount}
            onClick={() => onPageChange(meta.page + 1)}
          >
            <ChevronRight size={14} aria-hidden="true" />
          </PagerButton>
        </div>
      </div>
    </div>
  )
}
