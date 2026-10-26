import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuizShell from '../components/quiz/QuizShell'
import QuizIntro from '../components/quiz/QuizIntro'
import { api } from '../lib/api'

export default function QuizIntroPage() {
  const navigate = useNavigate()
  const { materialId } = useParams()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get(`/materials/${materialId}/quiz`)
      .then(res => {
        const resData = res.data?.data || res.data;
        if (resData.quiz && resData.quiz.questions?.length > 0) {
          setData(resData)
        } else {
          setError(true)
        }
      })
      .catch((err) => {
        console.error("Gagal memuat kuis:", err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [materialId])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-[16px] font-black text-[#62665c]">Memuat kuis...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-[16px] font-black text-[#dc2626]">Kuis belum tersedia atau gagal dimuat.</p>
        <button 
          onClick={() => navigate(`/materials/${materialId}/learning-path`)}
          className="text-[14px] font-bold text-[#405c04] hover:underline"
        >
          Kembali ke Materi
        </button>
      </div>
    )
  }

  // Gabungkan data quiz dengan latest_attempt agar sesuai dengan format QuizIntro
  const quizForIntro = {
    ...data.quiz,
    last: data.latest_attempt ? {
      pct: Math.round((data.latest_attempt.score / data.latest_attempt.total_questions) * 100),
      correct: data.latest_attempt.score
    } : null
  }

  return (
    <QuizShell view="intro" status="ready">
      <QuizIntro 
        d={quizForIntro} 
        on={{
          start: () => navigate(`/materials/${materialId}/quiz/question`),
          back: () => navigate(`/materials/${materialId}/learning-path`),
          review: () => {
            if (data.latest_attempt) {
              // Bawa jawaban sebelumnya ke halaman review
              navigate(`/materials/${materialId}/quiz/review`, { 
                state: { answers: data.latest_attempt.answers } 
              })
            }
          }
        }} 
      />
    </QuizShell>
  )
}