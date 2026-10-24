import { useNavigate, useParams } from 'react-router-dom';
import QuizShell from '../components/quiz/QuizShell';
import QuizReview from '../components/quiz/QuizReview';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizReviewPage() {
  const navigate = useNavigate();
  const { quizId = '1' } = useParams();

  return (
    <QuizShell view="review" status="ready">
      <QuizReview 
        d={SAMPLE} 
        on={{
          results: () => navigate(`/quizzes/${quizId}/results`)
        }} 
      />
    </QuizShell>
  );
}