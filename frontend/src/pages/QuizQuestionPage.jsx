import { useNavigate, useParams } from 'react-router-dom';
import QuizShell from '../components/quiz/QuizShell';
import QuizQuestion from '../components/quiz/QuizQuestion';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizQuestionPage() {
  const navigate = useNavigate();
  const { quizId = '1' } = useParams();

  return (
    <QuizShell view="question" status="ready">
      <QuizQuestion 
        d={SAMPLE} 
        on={{
          submit: (jawabanIndex) => {
            console.log("Jawaban dipilih:", jawabanIndex);
            // Pindah ke hasil setelah submit
            navigate(`/quizzes/${quizId}/results`);
          },
          exit: () => navigate(`/quizzes/${quizId}`)
        }} 
      />
    </QuizShell>
  );
}