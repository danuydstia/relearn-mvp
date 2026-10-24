import { useNavigate, useParams } from 'react-router-dom';
import QuizShell from '../components/quiz/QuizShell';
import QuizResults from '../components/quiz/QuizResults';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizResultsPage() {
  const navigate = useNavigate();
  const { quizId = '1' } = useParams();

  return (
    <QuizShell view="results" status="ready">
      <QuizResults 
        d={SAMPLE} 
        on={{
          review: () => navigate(`/quizzes/${quizId}/review`),
          retry: () => navigate(`/quizzes/${quizId}/question`),
          back: () => navigate('/learning')
        }} 
      />
    </QuizShell>
  );
}