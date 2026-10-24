import QuizShell from '../components/quiz/QuizShell';
import QuizReview from '../components/quiz/QuizReview';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizReviewPage({ status = "ready", data = SAMPLE, onAction = {} }) {
  const handleRetry = onAction.onRetry || (() => console.log('retry'));
  const handleStart = onAction.onStart || (() => console.log('start'));
  
  const stateAction = status === "empty" ? handleStart : handleRetry;

  return (
    <QuizShell view="review" status={status} onStateAction={stateAction}>
      <QuizReview d={data} on={{
        results: onAction.onBackToResults
      }} />
    </QuizShell>
  );
}