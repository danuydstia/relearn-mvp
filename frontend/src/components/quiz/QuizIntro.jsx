import { C, box, col, row, t } from './tokens';
import { Btn, Link, Note } from './ui';

export default function QuizIntro({ d, on }) {
  const stats = [[d.total, "Multiple-choice questions"], ["~8 min", "Estimated time · No timer"], ["1 answer", "Per question"]];
  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={box({ flex: 1, padding: 32, ...col(24) })}>
        <div style={{ width: 40, height: 40, position: "relative" }}><div style={{ position: "absolute", inset: "3px 7px", border: `1.7px solid ${C.ink}` }} /></div>
        <h2 style={t(28, 800, C.ink, { lineHeight: "42px" })}>A quick check, a clearer next step.</h2>
        <p style={t(14, 500, C.mute)}>Practice the SQL ideas from your learning path. You’ll receive a score and an explanation for every answer when you finish.</p>
        <div style={row(16)}>
          {stats.map(([v, l]) => (
            <div key={l} style={box({ flex: 1, padding: 20, ...col(16) })}>
              <p style={t(26, 800, C.ink, { lineHeight: "39px" })}>{v}</p>
              <p style={t(12, 600, C.mute)}>{l}</p>
            </div>
          ))}
        </div>
        <hr style={{ border: 0, height: 1, background: C.ink, width: "100%", margin: 0 }} />
        <p style={t(16, 800)}>Before you begin</p>
        <ul style={{ ...col(8), margin: 0, padding: "0 0 0 18px" }}>
          {["Submit one answer to move to the next question.", "Your progress saves as you go.", `Get feedback, then review all ${d.total} answers at the end.`, "This is practice, not an exam."].map((s) => <li key={s} style={t(13, 500)}>{s}</li>)}
        </ul>
        <div style={row(16)}>
          <Btn w={220} onClick={on.start}>Start quiz →</Btn>
          <Link onClick={on.back}>Back to learning path</Link>
        </div>
      </div>
      <aside style={{ width: 320, ...col(16) }}>
        <div style={box({ padding: 24, ...col(14) })}>
          <p style={t(16, 800)}>What you’ll practice</p>
          {d.topics.map((s) => <p key={s} style={t(13, 500, C.mute)}>{s}</p>)}
        </div>
        {d.last && (
          <div style={box({ padding: 24, ...col(14) })}>
            <p style={t(11, 700, C.mute)}>Quiz</p>
            <p style={t(14, 800)}>SQL Fundamentals</p>
            <p style={t(11, 500, C.mute)}>Previous attempt · {d.last.pct}% · {d.last.correct} of {d.total} correct</p>
            <Link onClick={on.review}>Review previous answers →</Link>
          </div>
        )}
        <Note>Generated from your course material. Revisit the source for more context.</Note>
      </aside>
    </div>
  );
}