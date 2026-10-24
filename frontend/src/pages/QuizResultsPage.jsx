import QuizShell from '../components/quiz/QuizShell';
import QuizResults from '../components/quiz/QuizResults';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizResultsPage({ status = "ready", data = SAMPLE, onAction = {} }) {
  const handleRefresh = onAction.onRefresh || (() => console.log('refresh'));
  const handleStart = onAction.onStart || (() => console.log('start'));
  
  const stateAction = status === "empty" ? handleStart : handleRefresh;

  return (
    <QuizShell view="results" status={status} onStateAction={stateAction}>
      <QuizResults d={data} on={{
        review: onAction.onReview,
        retry: onAction.onRetry,
        back: onAction.onBack
      }} />
    </QuizShell>
  );
}