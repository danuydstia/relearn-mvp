import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ModuleRow from '../components/learning/ModuleRow.jsx'
import Panel from '../components/learning/Panel.jsx'
import ProgressRing from '../components/learning/ProgressRing.jsx'
import Button from '../components/ui/Button.jsx'
import ProgressTrack from '../components/ui/ProgressTrack.jsx'
import { LoadingState, ErrorState } from '../components/learning/PageState.jsx'
import { getLearningPath } from '../lib/learningPath'

export default function LearningPathPage() {
  const { materialId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
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
    fetchData()
  }, [materialId])

  if (loading) return <div className="p-10"><LoadingState label="Memuat learning path..." /></div>
  if (error || !data) return <div className="p-10"><ErrorState title="Gagal memuat data" onRetry={() => window.location.reload()} /></div>

  // --- Kalkulasi Progress ---
  let totalTopics = 0
  let completedTopics = 0
  let nextTopic = null

  // Mapping modul agar sesuai dengan format ModuleRow
  const mappedModules = data.modules.map((mod, index) => {
    let modTotal = mod.topics.length
    let modCompleted = 0
    
    mod.topics.forEach(t => {
      totalTopics++
      if (t.is_completed) {
        completedTopics++
        modCompleted++
      } else if (!nextTopic) {
        nextTopic = t
      }
    })

    let status = 'in_progress'
    if (modCompleted === modTotal && modTotal > 0) {
      status = 'completed'
    }

    return {
      ...mod,
      status: status,
      totalTopics: modTotal,
      completedTopics: modCompleted,
      summary: `Modul ${mod.order_index}`, 
    }
  })

  const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)
  
  // Cek apakah benar-benar sudah 100% (Materi selesai DAN Kuis dikerjakan)
  const isFullyComplete = progress === 100 && data.has_completed_quiz

  // Jika semua materi selesai tapi kuis belum, nextTopic jadi null
  if (progress === 100) {
    nextTopic = null
  } else if (!nextTopic && data.modules.length > 0) {
    // Fallback jika karena suatu hal nextTopic tidak ditemukan
    const lastModule = data.modules[data.modules.length - 1]
    nextTopic = lastModule.topics[lastModule.topics.length - 1]
  }

  return (
    <div data-testid="learning-path-page" className="flex w-full flex-col px-6 pt-7 pb-8 md:px-8 md:py-8 lg:p-10 bg-[#f7f7f2] min-h-screen">
      <div data-testid="learning-content" className="mx-auto flex w-full max-w-[1128px] flex-col gap-7">
        <header className="flex w-full flex-col gap-2">
          <h1 className="text-[28px] leading-[1.5] font-black text-[#171916] md:text-[32px]">
            {data.title}
          </h1>
          <p className="text-[14px] leading-[1.5] font-medium text-[#62665c]">
            {totalTopics} topics · {data.modules.length} modules · {data.difficulty}
          </p>
        </header>

        <div data-testid="path-columns" className="flex w-full flex-col items-start gap-7 xl:flex-row">
          <div className="flex w-full min-w-px flex-col gap-4 xl:flex-1">
            <Panel data-testid="learning-path-modules" className="flex w-full flex-col gap-4 p-6">
              <div className="flex w-full items-center justify-between gap-3">
                <h2 className="text-[20px] leading-[1.5] font-black text-[#171916]">
                  Your learning path
                </h2>
                <span className="shrink-0 rounded-[6px] border border-solid border-[#171916] bg-[#d5f35b] px-[10px] py-[5px] text-[11px] leading-[normal] font-black whitespace-nowrap text-[#171916]">
                  {data.modules.length} modules
                </span>
              </div>

              <div className="flex w-full flex-col gap-4">
                {mappedModules.map((module) => (
                  <ModuleRow 
                    key={module.id} 
                    module={module} 
                    pathSlug={materialId} 
                  />
                ))}
              </div>
            </Panel>
          </div>

          <div data-testid="learning-path-rail" className="flex w-full flex-col gap-5 xl:w-[352px] xl:shrink-0">
            <Panel data-testid="path-progress-card" className="flex w-full flex-col p-6">
              <div className="flex w-full items-center gap-4">
                <div className="flex w-[100px] shrink-0 flex-col items-center gap-3">
                  <ProgressRing value={progress} />
                  <p className="w-full text-center text-[11px] leading-[1.5] font-medium text-[#62665c]">
                    Topics complete
                  </p>
                </div>
                <div className="flex min-w-px flex-1 flex-col gap-2">
                  <p className="text-[20px] leading-[1.5] font-black text-[#171916]">
                    {completedTopics} of {totalTopics}
                  </p>
                  {/* LOGIKA TEXT DIUBAH DI SINI */}
                  <p className="text-[12px] leading-[1.5] font-medium text-[#62665c]">
                    {isFullyComplete 
                      ? 'Selamat! Anda telah menyelesaikan seluruh materi dan kuis.' 
                      : progress === 100 
                        ? 'Materi selesai. Saatnya mengerjakan kuis!' 
                        : 'Your next topic is ready. Keep your momentum.'}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel data-testid="continue-card" className="flex w-full flex-col gap-4 p-6">
              <p className="text-[22px] leading-[1.5] font-black text-[#171916]">
                {isFullyComplete ? 'Course Completed' : 'Continue your last lesson'}
              </p>

              <div className="flex w-full flex-col gap-1">
                <p className="text-[11px] leading-[1.5] font-bold text-[#62665c]">
                  {isFullyComplete ? 'STATUS' : 'CURRENT TOPIC'}
                </p>
                <p className="text-[14px] leading-[1.5] font-black text-[#171916]">
                  {isFullyComplete 
                    ? 'Semua Materi & Kuis Selesai' 
                    : nextTopic 
                      ? nextTopic.title 
                      : 'Materi Selesai'}
                </p>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-start justify-between text-[12px] leading-[15px] whitespace-nowrap">
                  <p className="font-medium text-[#62665c]">Path progress</p>
                  <p className="font-black text-[#171916]">
                    {completedTopics} of {totalTopics} topics
                  </p>
                </div>
                <ProgressTrack value={progress} />
              </div>

              {/* LOGIKA TOMBOL DIUBAH DI SINI */}
              {isFullyComplete ? (
                <Button 
                  onClick={() => navigate(`/materials/${materialId}/quiz`)}
                  className="w-full bg-white text-[#171916]"
                >
                  Lihat Hasil Kuis →
                </Button>
              ) : progress === 100 ? (
                <Button 
                  onClick={() => navigate(`/materials/${materialId}/quiz`)}
                  className="w-full bg-[#d5f35b]"
                >
                  Kerjakan Kuis →
                </Button>
              ) : (
                nextTopic && (
                  <Button 
                    as={Link} 
                    to={`/materials/${materialId}/topics/${nextTopic.id}`} 
                    className="w-full"
                  >
                    Continue →
                  </Button>
                )
              )}
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}