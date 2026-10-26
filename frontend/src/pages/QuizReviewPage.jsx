import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import QuizShell from '../components/quiz/QuizShell'
import QuizReview from '../components/quiz/QuizReview'
import { api } from '../lib/api'

export default function QuizReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { materialId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)

  const userAnswers = location.state?.answers || {}

  useEffect(() => {
    api.get(`/materials/${materialId}/quiz`).then(res => {
      const resData = res.data?.data || res.data;
      const quizData = resData.quiz || {};

      setQuiz({ ...quizData, user_answers: userAnswers })
    }).catch(err => {
        console.error("Gagal memuat pembahasan:", err)
    }).finally(() => setLoading(false))
  }, [materialId, userAnswers])

  if (loading || !quiz) return <div className="p-10 font-bold">Memuat pembahasan...</div>

  return (
    <QuizShell view="review" status="ready">
      <QuizReview 
        d={quiz} 
        on={{
          results: () => navigate(`/materials/${materialId}/quiz/results`, { state: { answers: userAnswers } })
        }} 
      />
    </QuizShell>
  )
}