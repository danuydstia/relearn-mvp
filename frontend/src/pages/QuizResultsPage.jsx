import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import QuizShell from '../components/quiz/QuizShell'
import QuizResults from '../components/quiz/QuizResults'
import { api } from '../lib/api'

export default function QuizResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { materialId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const userAnswers = location.state?.answers || {}

  useEffect(() => {
    api.get(`/materials/${materialId}/quiz`).then(res => {
      const resData = res.data?.data || res.data;
      
      // PERBAIKAN: Ambil dari resData.quiz.questions
      const quizData = resData.quiz || {};
      const questions = quizData.questions || [];
      
      let score = 0
      questions.forEach(q => {
        if (userAnswers[q.id] === q.correct_option) score++
      })
      
      setQuiz({
        ...quizData,
        total_questions: questions.length, 
        result: { 
          pct: Math.round((score / (questions.length || 1)) * 100), 
          correct: score 
        }
      })
    }).catch(err => {
        console.error("Gagal memuat hasil:", err)
    }).finally(() => setLoading(false))
  }, [materialId, userAnswers])

  if (loading || !quiz) return <div className="p-10 font-bold">Menghitung skor...</div>

  return (
    <QuizShell view="results" status="ready">
      <QuizResults 
        d={quiz} 
        on={{
          review: () => navigate(`/materials/${materialId}/quiz/review`, { state: { answers: userAnswers } }),
          retry: () => navigate(`/materials/${materialId}/quiz/question`),
          back: () => navigate(`/materials/${materialId}/learning-path`)
        }} 
      />
    </QuizShell>
  )
}