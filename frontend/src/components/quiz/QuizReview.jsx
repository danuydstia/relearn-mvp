import { C, box, col, row, t } from './tokens';
import { Btn, Note, Pill } from './ui';

export default function QuizReview({ d, on }) {
  const wrong = d.answers.filter((a) => !a.ok);
  return (
    <div style={col(24)}>
      <div style={row(16)}>
        <Pill>{d.answers.length - wrong.length} correct</Pill>
        <Pill on={false}>{wrong.length} incorrect</Pill>
        <Note>Scroll through all {d.answers.length} explanations · Incorrect: {wrong.map((a) => a.no).join(" and ")}</Note>
        <span style={{ flex: 1 }} />
        <Btn w={180} onClick={on.results}>Back to results</Btn>
      </div>
      <ol style={{ ...col(16), listStyle: "none", margin: 0, padding: "0 12px 0 0", maxHeight: 576, overflowY: "auto" }}>
        {d.answers.map((a) => (
          <li key={a.no} style={box({ padding: 24, ...col(10) })}>
            <div style={row(16)}>
              <p style={t(16, 800, C.ink, { flex: 1, lineHeight: "24px" })}>{a.no}. {a.q}</p>
              <Pill on={a.ok}>{a.ok ? "Correct" : "Incorrect"}</Pill>
            </div>
            <p style={t(13, 700, a.ok ? C.link : C.red)}>Your answer: {a.yours}</p>
            {!a.ok && <p style={t(13, 700, C.link)}>Correct answer: {a.right}</p>}
            <p style={t(13, 500, C.mute)}>{a.why}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}