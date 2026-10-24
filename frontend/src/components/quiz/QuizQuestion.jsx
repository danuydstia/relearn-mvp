import { useState } from "react";
import { C, box, col, row, t } from './tokens';
import { Btn, Link, Note, Pill } from './ui';

export default function QuizQuestion({ d, on }) {
  const q = d.question;
  const [pick, setPick] = useState(null);
  const pct = Math.round((d.submitted / d.total) * 100);
  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={{ flex: 1, ...col(20) }}>
        <div style={row(16)}>
          <div style={{ width: 56, height: 56, borderRadius: 999, border: `2px solid ${C.ink}`, display: "grid", placeItems: "center", flex: "none",
            background: `conic-gradient(${C.lime} ${pct}%, ${C.paper} 0)` }}>
            <span style={{ ...t(13, 800), background: "white", borderRadius: 999, width: 40, height: 40, display: "grid", placeItems: "center" }}>{pct}%</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={t(13, 800)}>Question {q.no} / {d.total}</p>
            <p style={t(11, 600, C.mute)}>{d.submitted} answers submitted</p>
          </div>
          <Pill on={false}>Practice</Pill>
        </div>
        <fieldset style={box({ padding: 32, ...col(20), margin: 0, minWidth: 0 })}>
          <legend style={{ display: "none" }}>{q.text}</legend>
          <p style={t(11, 800)}>QUESTION {q.no} OF {d.total} · SINGLE CHOICE</p>
          <p style={t(24, 800, C.ink, { lineHeight: "36px" })}>{q.text}</p>
          <div style={col(12)}>
            {q.options.map((o, i) => {
              const sel = pick === i;
              return (
                <label key={o} style={{ ...box({ minHeight: 64, padding: "12px 16px", background: sel ? C.lime : "white", cursor: "pointer" }), display: "flex", alignItems: "center", gap: 14 }}>
                  <input type="radio" name="answer" checked={sel} onChange={() => setPick(i)} style={{ position: "absolute", opacity: 0 }} />
                  <span style={{ ...t(13, 800), width: 20 }}>{"ABCD"[i]}</span>
                  <span style={{ ...t(14, 700), flex: 1 }}>{o}</span>
                  <span style={{ width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${C.ink}`, background: sel ? C.ink : "white", boxShadow: sel ? "inset 0 0 0 3px white" : "none" }} />
                </label>
              );
            })}
          </div>
        </fieldset>
        <div style={row(16)}>
          <Link onClick={on.exit}>Exit quiz</Link>
          <Note>{pick === null ? "Choose one answer" : "Ready to submit"}</Note>
          <span style={{ flex: 1 }} />
          <Btn w={200} disabled={pick === null} onClick={() => on.submit(pick)}>Submit answer</Btn>
        </div>
        <Note>Answers save after submission. You can leave and resume this practice quiz.</Note>
      </div>
      <aside style={{ width: 264, ...col(16) }}>
        {/* ... sisa sidebar tetap sama ... */}
        <div style={box({ padding: 20, ...col(16) })}>
          <p style={t(16, 800)}>Your attempt</p>
          <div><Pill>Practice · No timer</Pill></div>
          <p style={t(13, 500, C.mute)}>Questions 1–{d.submitted} submitted. Question {q.no} is ready for your answer.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Array.from({ length: d.total }, (_, i) => i + 1).map((n) => (
              <Pill key={n} on={n <= q.no}>{n <= d.submitted ? `${n} ✓` : n}</Pill>
            ))}
          </div>
          <Note>A complete answer review is available after all {d.total} questions.</Note>
        </div>
        <div style={box({ padding: 20, ...col(12) })}>
          <p style={t(13, 800)}>A moment to think</p>
          <p style={t(12, 500, C.mute)}>{d.hint}</p>
        </div>
      </aside>
    </div>
  );
}