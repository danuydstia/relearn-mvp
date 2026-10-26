import { C, box, col, row, t } from './tokens';
import { Btn, Note, Pill } from './ui';

export default function QuizReview({ d, on }) {
  // d berisi: questions, user_answers
  const questions = d?.questions || [];
  const userAnswers = d?.user_answers || {};

  // Format ulang data agar sesuai dengan UI Lama
  const formattedAnswers = questions.map((q, index) => {
    const userKey = userAnswers[q.id];
    const isCorrect = userKey === q.correct_option;
    
    // Ambil teks opsi asli
    const userText = userKey ? q.options[userKey.charCodeAt(0) - 65] : "Tidak dijawab";
    const correctText = q.options[q.correct_option.charCodeAt(0) - 65];

    return {
      no: index + 1,
      q: q.question_text,
      ok: isCorrect,
      yours: userText,
      right: correctText,
      why: q.explanation
    };
  });

  const wrong = formattedAnswers.filter((a) => !a.ok);

  return (
    <div style={col(24)}>
      <div style={row(16)}>
        <Pill>{formattedAnswers.length - wrong.length} correct</Pill>
        <Pill on={false}>{wrong.length} incorrect</Pill>
        <Note>Scroll through all {formattedAnswers.length} explanations {wrong.length > 0 ? `· Incorrect: ${wrong.map((a) => a.no).join(" and ")}` : ''}</Note>
        <span style={{ flex: 1 }} />
        <Btn w={180} onClick={on.results}>Back to results</Btn>
      </div>

      <ol style={{ ...col(16), listStyle: "none", margin: 0, padding: "0 12px 0 0", maxHeight: 576, overflowY: "auto" }}>
        {formattedAnswers.map((a) => (
          <li key={a.no} style={box({ padding: 24, ...col(10) })}>
            <div style={row(16)}>
              <p style={t(16, 800, C.ink, { flex: 1, lineHeight: "24px" })}>{a.no}. {a.q}</p>
              <Pill on={a.ok}>{a.ok ? "Correct" : "Incorrect"}</Pill>
            </div>
            <p style={t(13, 700, a.ok ? C.green : C.red)}>Your answer: {a.yours}</p>
            {!a.ok && <p style={t(13, 700, C.green)}>Correct answer: {a.right}</p>}
            <p style={t(13, 500, C.mute)}>{a.why}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}