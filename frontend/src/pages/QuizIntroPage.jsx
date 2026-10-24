import { useNavigate, useParams } from 'react-router-dom';
import QuizShell from '../components/quiz/QuizShell';
import QuizIntro from '../components/quiz/QuizIntro';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizIntroPage() {
  const navigate = useNavigate();
  // Jika diakses via /quizzes, quizId-nya undefined, jadi kita kasih default '1'
  const { quizId = '1' } = useParams(); 

  return (
    <QuizShell view="intro" status="ready">
      <QuizIntro 
        d={SAMPLE} 
        on={{
          start: () => navigate(`/quizzes/${quizId}/question`),
          back: () => navigate('/learning'),
          review: () => navigate(`/quizzes/${quizId}/review`)
        }} 
      />
    </QuizShell>
  );
}