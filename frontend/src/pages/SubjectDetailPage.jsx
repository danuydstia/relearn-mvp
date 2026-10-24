import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Folder } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import { getSubject, materialsUrl } from '../lib/subjects'

/**
 * SubjectDetailPage — detail satu subject: header, daftar Notes, daftar Exams.
 * Latar punya glow lime di kiri bawah (radial gradient, 20% opacity).
 */
function SectionTitle({ title, count }) {
  return (
    <div className="flex items-baseline gap-2">
      <h2 className="text-[16px] leading-[24px] font-black text-[#171916]">{title}</h2>
      <p className="text-[13px] leading-[20px] font-bold text-[#62665c]">{count}</p>
    </div>
  )
}

function EmptyRow({ children }) {
  return (
    <Card className="flex h-[104px] w-full items-center justify-center px-4 text-center">
      <p className="text-[14px] leading-[22px] font-bold text-[#62665c]">{children}</p>
    </Card>
  )
}

export default function SubjectDetailPage() {
  const { subjectSlug } = useParams()
  const subject = getSubject(subjectSlug)

  if (!subject) {
    return <Navigate to={materialsUrl()} replace />
  }

  const { notes, exams } = subject

  return (
    <div className="relative flex w-full flex-1 flex-col gap-10 overflow-hidden bg-[#f7f7f2] px-6 pt-9 pb-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1040px] w-[1160px] max-w-none"
        style={{
          background:
            'radial-gradient(ellipse 52% 68% at 36% 93%, rgba(200, 255, 0, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
        }}
      />

      <div className="relative flex w-full flex-col gap-8">
        <Link
          to={materialsUrl()}
          className="inline-flex min-h-11 items-center gap-2 self-start text-[13px] leading-[20px] font-black text-[#62665c] hover:text-[#171916] hover:underline"
        >
          <ArrowLeft size={18} strokeWidth={1.7} aria-hidden="true" />
          Subjects
        </Link>

        <div className="flex w-full items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-solid border-[#171916] bg-[#d5f35b]">
            <Folder size={26} strokeWidth={1.7} className="text-[#171916]" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h1 className="text-[28px] leading-[40px] font-black text-[#171916]">{subject.title}</h1>
            <p className="text-[13px] leading-[20px] font-bold text-[#62665c]">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} · {exams.length}{' '}
              {exams.length === 1 ? 'exam' : 'exams'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col gap-10">
        <section className="flex w-full flex-col gap-4">
          <SectionTitle title="Notes" count={notes.length} />

          {notes.length === 0 ? (
            <EmptyRow>There are no notes for this subject yet</EmptyRow>
          ) : (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <Card key={note.id} className="flex w-full flex-col gap-4 p-6">
                  <div className="flex w-full items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-solid border-[#171916] bg-[#d5f35b]">
                      <FileText size={18} strokeWidth={1.7} className="text-[#171916]" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-[10px] leading-[14px] font-black text-[#62665c]">NOTE</p>
                      <p className="truncate text-[12px] leading-[18px] font-bold text-[#62665c]">
                        {subject.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-1.5">
                    <p className="text-[16px] leading-[22px] font-black text-[#171916]">{note.title}</p>
                    <p className="line-clamp-2 text-[12px] leading-[18px] font-medium text-[#62665c]">
                      {note.summary}
                    </p>
                  </div>

                  <p className="w-full text-right text-[12px] leading-[18px] font-bold text-[#62665c]">
                    {note.date}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="flex w-full flex-col gap-4">
          <SectionTitle title="Exams" count={exams.length} />

          {exams.length === 0 ? (
            <EmptyRow>There are no exams for this subject yet</EmptyRow>
          ) : (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {exams.map((exam) => (
                <Card key={exam.id} className="flex w-full flex-col gap-1.5 p-6">
                  <p className="text-[16px] leading-[22px] font-black text-[#171916]">{exam.title}</p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}