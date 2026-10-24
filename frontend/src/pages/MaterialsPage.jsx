import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import SubjectCard from '../components/materials/SubjectCard.jsx'
import Pagination from '../components/materials/Pagination.jsx'
import { subjects } from '../lib/subjects'

/**
 * MaterialsPage — daftar subject.
 * Judul + subjudul, kolom pencarian penuh lebar, grid kartu subject, dan
 * pagination di bawah (menempel ke dasar halaman lewat mt-auto).
 * Gutter 24px, padding atas 36 dan bawah 40, sesuai desain.
 */
const PAGE_SIZE = 9

export default function MaterialsPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return subjects
    return subjects.filter((subject) =>
      [subject.title, ...subject.notes.map((note) => note.title)].some((text) =>
        text.toLowerCase().includes(q),
      ),
    )
  }, [query])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="flex w-full flex-1 flex-col gap-6 bg-[#f7f7f2] px-6 pt-9 pb-10">
      <div className="flex w-full flex-col gap-6">
        <header className="flex w-full flex-col gap-0.5">
          <h1 className="text-[28px] leading-[40px] font-black text-[#171916]">Materials</h1>
          <p className="text-[13px] leading-[20px] font-bold text-[#62665c]">
            Manage your subject list to organize your notes
          </p>
        </header>

        <label className="relative block w-full">
          <span className="sr-only">Search your materials</span>
          <Search
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 text-[#62665c]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search your materials..."
            className="h-11 w-full rounded-[8px] border-2 border-solid border-[#171916] bg-white pr-[14px] pl-10 text-[13px] font-bold text-[#171916] placeholder:font-black placeholder:text-[#62665c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]"
          />
        </label>
      </div>

      {total === 0 ? (
        <Card className="flex h-[104px] w-full items-center justify-center px-4 text-center">
          <p className="text-[14px] leading-[22px] font-bold text-[#62665c]">
            {query.trim() ? 'No materials match your search' : 'There are no subjects yet'}
          </p>
        </Card>
      ) : (
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((subject) => (
            <SubjectCard key={subject.slug} subject={subject} />
          ))}
        </div>
      )}

      {total > 0 && (
        <Pagination
          className="mt-auto pt-6"
          page={currentPage}
          pageCount={pageCount}
          from={start + 1}
          to={start + visible.length}
          total={total}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}