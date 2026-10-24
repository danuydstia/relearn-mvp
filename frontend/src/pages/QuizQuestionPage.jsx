import QuizShell from '../components/quiz/QuizShell';
import QuizQuestion from '../components/quiz/QuizQuestion';
import { SAMPLE } from '../components/quiz/sampleData';

export default function QuizQuestionPage({ status = "ready", data = SAMPLE, onAction = {} }) {
  const handleRetry = onAction.onRetry || (() => console.log('retry'));
  const handleBack = onAction.onBack || (() => console.log('back'));
  
  const stateAction = status === "empty" ? handleBack : handleRetry;

  return (
    <QuizShell view="question" status={status} onStateAction={stateAction}>
      <QuizQuestion d={data} on={{
        submit: onAction.onSubmit,
        exit: onAction.onExit
      }} />
    </QuizShell>
  );
}