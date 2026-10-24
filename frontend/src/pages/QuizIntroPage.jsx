import QuizShell from '../components/quiz/QuizShell';
import QuizIntro from '../components/quiz/QuizIntro';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizIntroPage({ status = "ready", data = SAMPLE, onAction = {} }) {
  // onAction dari props bisa berisi fungsi API (onStart, onBack, dll)
  const handleRetry = onAction.onRetry || (() => console.log('retry'));
  const handleBack = onAction.onBack || (() => console.log('back'));
  
  const stateAction = status === "empty" ? handleBack : handleRetry;

  return (
    <QuizShell view="intro" status={status} onStateAction={stateAction}>
      <QuizIntro d={data} on={{
        start: onAction.onStart,
        back: onAction.onBack,
        review: onAction.onReview
      }} />
    </QuizShell>
  );
}