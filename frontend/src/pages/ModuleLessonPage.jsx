import { Fragment, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { LessonOutline, PracticePanel } from '../components/learning/LessonOutline.jsx'
import Panel from '../components/learning/Panel.jsx'
import Button from '../components/ui/Button.jsx'
import { LoadingState, ErrorState } from '../components/learning/PageState.jsx'
import { getLearningPath, markTopicComplete } from '../lib/learningPath'

export default function ModuleLessonPage() {
  // Menggunakan materialId dan topicId dari URL
  const { materialId, topicId } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getLearningPath(materialId)
      setData(res)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [materialId])

  if (loading) return <div className="p-10"><LoadingState label="Memuat materi..." /></div>
  if (error || !data) return <div className="p-10"><ErrorState title="Gagal memuat materi" onRetry={fetchData} /></div>

  // 1. Ratakan semua topik untuk mencari Previous & Next
  const flatTopics = []
  data.modules.forEach(mod => {
    mod.topics.forEach(t => {
      flatTopics.push({ ...t, moduleId: mod.id, moduleTitle: mod.title, moduleOrder: mod.order_index })
    })
  })

  // 2. Cari posisi topik saat ini
  const currentIndex = flatTopics.findIndex(t => t.id.toString() === topicId.toString())
  
  if (currentIndex === -1) {
    return <div className="p-10 font-bold text-xl">Topik tidak ditemukan.</div>
  }

  const currentTopic = flatTopics[currentIndex]
  const currentModule = data.modules.find(m => m.id === currentTopic.moduleId)
  const prevTopic = currentIndex > 0 ? flatTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < flatTopics.length - 1 ? flatTopics[currentIndex + 1] : null

  const topicLabel = `Topic ${currentIndex + 1} of ${flatTopics.length}`

  // 3. Fungsi saat tombol Next diklik
  const handleNext = async () => {
    try {
      setIsCompleting(true)
      // Tembak API untuk tandai selesai jika belum
      if (!currentTopic.is_completed) {
        await markTopicComplete(materialId, currentTopic.id)
      }
      
      if (nextTopic) {
        navigate(`/materials/${materialId}/topics/${nextTopic.id}`)
        fetchData() // Refresh data agar status is_completed terupdate
      } else {
        navigate(`/materials/${materialId}/learning-path`)
      }
    } catch (err) {
      alert('Gagal menyimpan progress. Coba lagi.')
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div data-testid="lesson-page" className="flex w-full flex-col px-6 pt-7 pb-8 md:px-8 md:py-8 lg:p-10 bg-[#f7f7f2] min-h-screen">
      <div data-testid="lesson-content" className="mx-auto flex w-full max-w-[1128px] flex-col gap-7">
        
        <header className="flex w-full flex-col gap-2">
          <h1 className="text-[28px] leading-[1.5] font-black text-[#171916] md:text-[32px]">
            {data.title} {/* Ini judul Course-nya */}
          </h1>
          <p className="text-[14px] leading-[1.5] font-medium text-[#62665c]">
            Module {currentModule.order_index} · {topicLabel} · About {currentTopic.estimated_minutes} minutes
          </p>
        </header>

        <div data-testid="lesson-columns" className="flex w-full flex-col items-start gap-7 xl:flex-row">
          
          {/* Sidebar Kiri */}
          <div className="order-2 flex w-full flex-col gap-4 xl:order-1 xl:w-[264px] xl:shrink-0">
            <LessonOutline
              pathData={data}
              currentTopicId={currentTopic.id}
              pathSlug={materialId}
            />
            <PracticePanel quiz={{ title: 'Quiz', questions: 5, minutes: 10 }} />
          </div>

          {/* Konten Utama */}
          <div className="order-1 flex w-full min-w-px flex-col gap-5 xl:order-2 xl:flex-1">
            <Panel data-testid="lesson-surface" className="flex w-full flex-col gap-4 p-6 sm:p-8">
              <span className="self-start rounded-[8px] border-2 border-solid border-[#171916] bg-[#d5f35b] px-[10px] py-[5px] text-[11px] leading-[normal] font-black whitespace-nowrap text-[#171916]">
                READ · UNDERSTAND · APPLY
              </span>

              <h2 className="text-[24px] leading-[1.5] font-black text-[#171916]">
                {currentTopic.title}
              </h2>

              {/* Render Markdown dari AI */}
              <div className="prose prose-lg max-w-none text-[#171916] font-medium text-[14px] leading-[1.5]">
                <ReactMarkdown>{currentTopic.content}</ReactMarkdown>
              </div>
            </Panel>

            {/* Tombol Navigasi Footer */}
            <div data-testid="lesson-footer" className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
              
              {/* Tombol Previous */}
              {prevTopic ? (
                <Link
                  to={`/materials/${materialId}/topics/${prevTopic.id}`}
                  className="self-start text-left text-[13px] leading-[1.5] font-black whitespace-nowrap text-[#405c04] hover:underline"
                >
                  ← Previous: {prevTopic.title}
                </Link>
              ) : (
                <button disabled className="self-start text-left text-[13px] leading-[1.5] font-black whitespace-nowrap text-[#405c04] opacity-50 cursor-not-allowed">
                  ← Previous
                </button>
              )}

              <p className="text-[11px] leading-[1.5] font-bold text-[#62665c] sm:flex-1 text-center">
                {topicLabel}
              </p>

              <div className="flex w-full items-center gap-4 sm:w-auto sm:shrink-0">
                <Link
                  to="#"
                  className="inline-flex min-h-11 flex-1 items-center text-[13px] leading-[1.5] font-black whitespace-nowrap text-[#405c04] hover:underline sm:flex-none"
                >
                  Take quiz →
                </Link>

                {/* Tombol Next / Selesai */}
                <Button
                  onClick={handleNext}
                  disabled={isCompleting}
                  className={`inline-flex h-[46px] flex-1 items-center justify-center px-[18px] text-[12px] font-bold whitespace-nowrap sm:flex-none ${
                    currentTopic.is_completed ? "bg-gray-300 border-gray-500" : "bg-[#d5f35b]"
                  }`}
                >
                  {isCompleting ? 'Menyimpan...' : nextTopic ? 'Next lesson →' : 'Selesai & Kembali'}
                </Button>
              </div>
            </div>

          </div>
        </div>

        <p className="text-[11px] leading-[1.5] font-medium text-[#62665c]">
          Materi di-generate secara otomatis oleh AI.
        </p>
      </div>
    </div>
  )
}