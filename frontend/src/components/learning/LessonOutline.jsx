import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, CircleCheck, Circle } from 'lucide-react'
import ProgressTrack from '../ui/ProgressTrack.jsx'
import Panel from './Panel.jsx'

export function LessonOutline({ pathData, currentTopicId, pathSlug }) {
  // Cari modul dari topik yang sedang dibuka
  const currentModule = pathData.modules.find(m => m.topics.some(t => t.id === currentTopicId))

  // State untuk melacak modul mana saja yang sedang terbuka (dropdown)
  // Secara default, buka modul yang sedang dipelajari
  const [openModules, setOpenModules] = useState(() => {
    const initial = {}
    pathData.modules.forEach(m => {
      initial[m.id] = m.id === currentModule?.id
    })
    return initial
  })

  // Kalkulasi progress
  let totalTopics = 0
  let completedTopics = 0
  pathData.modules.forEach(mod => {
    totalTopics += mod.topics.length
    completedTopics += mod.topics.filter(t => t.is_completed).length
  })

  const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)

  const toggleModule = (moduleId) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  return (
    // Menghapus class 'sticky top-6' agar tidak menimpa PracticePanel
    <Panel data-testid="lesson-outline" className="flex w-full flex-col gap-4 p-5">
      <p className="text-[16px] leading-[1.5] font-black text-[#171916]">Module outline</p>

      {/* Progress Global */}
      <div className="flex w-full flex-col gap-2 mb-2">
        <div className="flex w-full items-start justify-between text-[12px] leading-[15px] whitespace-nowrap">
          <p className="font-medium text-[#62665c]">Path progress</p>
          <p className="font-black text-[#171916]">
            {completedTopics} of {totalTopics} topics
          </p>
        </div>
        <ProgressTrack value={progress} />
      </div>

      <div className="h-px w-full shrink-0 bg-[#171916] opacity-[0.12] mb-2" />

      {/* Daftar Modul (Accordion) */}
      <div className="flex flex-col gap-3">
        {pathData.modules.map((mod) => {
          const isOpen = openModules[mod.id]
          const isCurrentMod = mod.id === currentModule?.id

          return (
            <div key={mod.id} className="flex flex-col gap-1">
              
              {/* Header Modul (Bisa di-klik) */}
              <button
                onClick={() => toggleModule(mod.id)}
                className={`flex w-full items-start gap-2 text-left group transition-colors ${isCurrentMod ? 'text-[#405c04]' : 'text-[#171916]'}`}
              >
                <div className="mt-0.5 shrink-0">
                  {isOpen ? <ChevronDown size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
                </div>
                <div className="flex flex-col">
                  <p className={`text-[13px] leading-[1.4] font-black ${isCurrentMod ? 'text-[#405c04]' : ''}`}>
                    {mod.title}
                  </p>
                  <p className="text-[11px] font-medium text-[#62665c]">
                    {mod.topics.filter(t => t.is_completed).length}/{mod.topics.length} selesai
                  </p>
                </div>
              </button>

              {/* List Topik (Dropdown) */}
              {isOpen && (
                <div className="flex flex-col gap-2.5 pl-6 mt-2 ml-2 border-l-2 border-solid border-[#171916]/10">
                  {mod.topics.map((topic) => {
                    const isCurrentTopic = topic.id === currentTopicId
                    return (
                      <Link
                        key={topic.id}
                        to={`/materials/${pathSlug}/topics/${topic.id}`}
                        className={`flex items-start gap-2 text-[12px] leading-[1.4] font-medium hover:underline ${
                          isCurrentTopic ? 'text-[#405c04] font-black' : 'text-[#62665c]'
                        }`}
                      >
                        <div className="mt-[2px] shrink-0">
                          {topic.is_completed ? (
                            <CircleCheck size={14} className="text-[#059669]" />
                          ) : (
                            <Circle size={14} className={isCurrentTopic ? "text-[#405c04]" : "text-[#94a3b8]"} />
                          )}
                        </div>
                        <span>{topic.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="h-px w-full shrink-0 bg-[#171916] opacity-[0.12] mt-2" />

      <Link
        to={`/materials/${pathSlug}/learning-path`}
        className="self-start text-[13px] leading-[1.5] font-black whitespace-nowrap text-[#405c04] hover:underline mt-2"
      >
        Back to learning path →
      </Link>
    </Panel>
  )
}

export function PracticePanel({ quiz }) {
  return (
    <Panel data-testid="practice-panel" className="flex w-full flex-col gap-4 p-5">
      <p className="text-[13px] leading-[1.5] font-black text-[#171916]">
        Practice when you're ready
      </p>
      <p className="text-[12px] leading-[1.5] font-medium text-[#62665c]">
        {quiz.title} checks your understanding of this module.
      </p>
      <Link
        to="#"
        className="self-start text-[13px] leading-[1.5] font-black whitespace-nowrap text-[#405c04] hover:underline"
      >
        Quiz details →
      </Link>
    </Panel>
  )
}