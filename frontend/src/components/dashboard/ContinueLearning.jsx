import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Database, BookOpen } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import TextAction from '../ui/TextAction.jsx'
import SegmentedProgress from '../ui/SegmentedProgress.jsx'
import { api } from '../../lib/api'
import { getLearningPath } from '../../lib/learningPath'

export default function ContinueLearning() {
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      try {
        // 1. Ambil semua materials
        const res = await api.get('/materials')
        const materials = res.data.data || []
        
        // 2. Filter hanya yang sudah 'processed' (selesai di-generate AI) dan ambil 2 terbaru
        const processed = materials.filter(m => m.status === 'processed').slice(0, 2)

        // 3. Untuk setiap material, ambil detail learning path-nya
        const detailed = await Promise.all(processed.map(async (mat) => {
          try {
            const pathData = await getLearningPath(mat.id)
            return { material: mat, path: pathData }
          } catch (err) {
            return null // Jika gagal ambil path, abaikan
          }
        }))

        // Bersihkan data yang null
        setRecentItems(detailed.filter(item => item !== null))
      } catch (err) {
        console.error("Gagal memuat recent learning", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecent()
  }, [])

  if (loading) return null // Atau tampilkan skeleton
  if (recentItems.length === 0) return null // Sembunyikan jika belum ada materi yang selesai diproses

  const featured = recentItems[0]
  const compact = recentItems[1]

  // Helper untuk mendapatkan info progress & topik saat ini
  const getProgressInfo = (path) => {
    let totalTopics = 0
    let completedTopics = 0
    let currentTopic = null
    let nextTopic = null

    // Ratakan semua topik
    const flatTopics = []
    path.modules.forEach(mod => {
      mod.topics.forEach(t => flatTopics.push(t))
    })

    totalTopics = flatTopics.length
    completedTopics = flatTopics.filter(t => t.is_completed).length

    // Cari topik pertama yang belum selesai
    const firstUncompletedIndex = flatTopics.findIndex(t => !t.is_completed)
    
    if (firstUncompletedIndex !== -1) {
      currentTopic = flatTopics[firstUncompletedIndex]
      if (firstUncompletedIndex + 1 < flatTopics.length) {
        nextTopic = flatTopics[firstUncompletedIndex + 1]
      }
    } else if (flatTopics.length > 0) {
      // Jika semua sudah selesai, arahkan ke topik terakhir untuk review
      currentTopic = flatTopics[flatTopics.length - 1]
    }

    return { totalTopics, completedTopics, currentTopic, nextTopic }
  }

  const featuredProgress = getProgressInfo(featured.path)
  const compactProgress = compact ? getProgressInfo(compact.path) : null

  // Helper untuk membersihkan nama file dari path
  const getFileName = (pathStr) => {
    if (!pathStr) return 'Document'
    return pathStr.split('/').pop()
  }

  return (
    <section className="flex w-full flex-col gap-4">
      <SectionHeading
        title="Continue Learning"
        action={
          <TextAction as={Link} to="/materials">
            <span className="md:hidden">View all</span>
            <span className="hidden md:inline">My Learning →</span>
          </TextAction>
        }
      />

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,808fr)_minmax(0,252fr)]">
        
        {/* ── Featured (putih) ── */}
        <Card className="flex w-full flex-col gap-5 p-[26px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={18} strokeWidth={1.75} className="shrink-0 text-[#171916]" aria-hidden="true" />
              <p className="text-[10px] leading-[1.4] font-black whitespace-nowrap text-[#62665c] uppercase">
                {featured.path.difficulty || 'General'}
              </p>
            </div>
            <p className="text-[10px] leading-[1.4] font-black whitespace-nowrap text-[#62665c]">
              Baru saja
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <p className="text-[26px] leading-[1.08] font-extrabold text-[#171916] md:text-[34px]">
              {featured.path.title}
            </p>
            <p className="text-[12px] leading-[1.5] font-normal text-[#62665c] truncate">
              Source · {getFileName(featured.material.file_path)}
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 border-y border-solid border-[#171916] py-4 md:flex-row md:items-center md:gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-[10px] leading-[1.4] font-black text-[#62665c]">CURRENT TOPIC</p>
              <p className="text-[18px] font-bold text-[#171916] truncate">
                {featuredProgress.currentTopic ? featuredProgress.currentTopic.title : 'Selesai'}
              </p>
              {featuredProgress.nextTopic && (
                <p className="text-[12px] leading-[1.5] font-normal text-[#62665c] truncate">
                  Next · {featuredProgress.nextTopic.title}
                </p>
              )}
            </div>
            
            {/* Tombol langsung menuju topik yang belum selesai */}
            <Button 
              as={Link} 
              to={featuredProgress.currentTopic 
                ? `/materials/${featured.material.id}/topics/${featuredProgress.currentTopic.id}`
                : `/materials/${featured.material.id}/learning-path`
              } 
              className="shrink-0"
            >
              Continue →
            </Button>
          </div>

          <div className="flex w-full flex-col gap-[9px]">
            <div className="flex w-full items-start justify-between">
              <p className="text-[10px] font-black text-[#62665c]">Path progress</p>
              <p className="text-[11px] font-black text-[#171916]">
                {featuredProgress.completedTopics} of {featuredProgress.totalTopics} topics
              </p>
            </div>
            <SegmentedProgress done={featuredProgress.completedTopics} total={featuredProgress.totalTopics} />
          </div>

          <p className="text-[11px] leading-[1.5] font-normal text-[#62665c]">
            Lanjutkan dari topik terakhir Anda.
          </p>
        </Card>

        {/* ── Compact (hitam) ── */}
        {compact ? (
          <div className="flex w-full flex-col gap-5 rounded-[4px] border-2 border-solid border-[#171916] bg-[#171916] p-[26px]">
            <div className="flex w-full items-center justify-between">
              <Brain size={22} strokeWidth={1.7} className="shrink-0 text-[#d5f35b]" aria-hidden="true" />
              <p className="text-[10px] leading-[1.4] font-black text-[#bcc0b5]">Sebelumnya</p>
            </div>

            <div className="flex w-full flex-col gap-2">
              <p className="text-[28px] leading-[1.1] font-extrabold text-white lg:text-[32px] line-clamp-2">
                {compact.path.title}
              </p>
              <p className="text-[12px] leading-[1.5] font-normal text-[#bcc0b5] truncate">
                Source · {getFileName(compact.material.file_path)}
              </p>
            </div>

            <div className="flex w-full flex-col gap-[7px] py-[15px]">
              <p className="text-[10px] leading-[1.4] font-black text-[#bcc0b5]">Current topic</p>
              <p className="text-[20px] font-semibold text-white line-clamp-1">
                 {compactProgress.currentTopic ? compactProgress.currentTopic.title : 'Selesai'}
              </p>
            </div>

            <div className="flex w-full flex-col gap-[9px]">
              <div className="flex w-full items-start justify-between">
                <p className="text-[10px] font-black text-[#bcc0b5]">Path progress</p>
                <p className="text-[11px] font-black text-white">
                  {compactProgress.completedTopics} of {compactProgress.totalTopics} topics
                </p>
              </div>
              <SegmentedProgress done={compactProgress.completedTopics} total={compactProgress.totalTopics} tone="dark" />
            </div>

            <Button 
              variant="secondary" 
              as={Link} 
              to={compactProgress.currentTopic 
                ? `/materials/${compact.material.id}/topics/${compactProgress.currentTopic.id}`
                : `/materials/${compact.material.id}/learning-path`
              } 
              className="self-start"
            >
              Continue →
            </Button>
          </div>
        ) : (
          // Placeholder jika baru ada 1 materi
           <div className="flex w-full flex-col gap-5 rounded-[4px] border-2 border-solid border-[#171916] bg-[#171916] p-[26px] items-center justify-center text-center opacity-50">
              <BookOpen size={32} className="text-[#bcc0b5] mb-2" />
              <p className="text-[14px] font-medium text-[#bcc0b5]">Belum ada materi lain</p>
              <p className="text-[11px] text-[#bcc0b5]">Upload PDF baru untuk memulai topik berbeda.</p>
           </div>
        )}
      </div>
    </section>
  )
}