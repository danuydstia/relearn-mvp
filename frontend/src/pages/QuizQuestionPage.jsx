import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuizShell from '../components/quiz/QuizShell'
import QuizQuestion from '../components/quiz/QuizQuestion'
import { api } from '../lib/api'

export default function QuizQuestionPage() {
  const navigate = useNavigate()
  const { materialId } = useParams()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 1. Ambil data kuis dari Laravel
  useEffect(() => {
    api.get(`/materials/${materialId}/quiz`)
      .then((res) => {
        const resData = res.data?.data || res.data;
        if (resData.quiz) setQuiz(resData.quiz);
        else setQuiz(resData); // fallback
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
        <p className="text-[16px] font-black text-[#62665c]">Memuat soal kuis...</p>
      </div>
    )
  }

  if (error || !quiz) {
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

  // 2. Render komponen kuis
  return (
    <QuizShell view="question" status="ready">
      <QuizQuestion 
        d={quiz} 
        on={{
          submit: async (answers) => {
            // Hitung skor di frontend untuk dikirim ke backend
            let score = 0
            quiz.questions.forEach(q => {
              if (answers[q.id] === q.correct_option) score++
            })

            try {
              // Simpan attempt ke database Laravel
              await api.post(`/materials/${materialId}/quiz/attempt`, {
                answers: answers,
                score: score,
                total_questions: quiz.questions.length
              })
              
              // Arahkan ke halaman hasil sambil membawa data jawaban
              navigate(`/materials/${materialId}/quiz/results`, { 
                state: { answers } 
              })
            } catch (err) {
              console.error("Gagal menyimpan attempt:", err)
              alert("Gagal menyimpan jawaban kuis Anda. Silakan coba lagi.")
            }
          },
          exit: () => navigate(`/materials/${materialId}/quiz`)
        }} 
      />
    </QuizShell>
  )
}