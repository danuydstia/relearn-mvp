import { C, box, col, row, t } from './tokens';
import { Btn, Link, Note, Pill } from './ui';

export default function QuizResults({ d, on }) {
  const r = d.result;
  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={{ flex: 1, ...col(16) }}>
        <div style={box({ padding: 28, ...col(20) })}>
          <div style={row(32)}>
            <div style={{ width: 160, flex: "none", ...col(12), alignItems: "center" }}>
              <div style={{ width: 160, height: 160, borderRadius: 999, border: `2px solid ${C.ink}`, display: "grid", placeItems: "center", background: `conic-gradient(${C.lime} ${r.pct}%, ${C.paper} 0)` }}>
                <span style={{ ...t(32, 800), width: 116, height: 116, background: "white", borderRadius: 999, display: "grid", placeItems: "center" }}>{r.pct}%</span>
              </div>
              <Note>Quiz score</Note>
            </div>
            <div style={{ flex: 1, ...col(8), alignItems: "flex-start" }}>
              <Pill>Practice complete</Pill>
              <h2 style={t(28, 800, C.ink, { lineHeight: "42px" })}>A strong step forward, {d.name}.</h2>
              <p style={t(14, 500, C.mute)}>{r.correct} of {d.total} questions correct. You’ve got the foundations; revisit joins and grouped filters next.</p>
            </div>
          </div>
          <hr style={{ border: 0, height: 1, background: C.ink, width: "100%", margin: 0 }} />
          <div style={row(16)}>
            {[[`+${r.xp} XP`, "Illustrative earned XP"], [`+${r.tokens} tokens`, "Illustrative reward entry"], [r.time, "Time spent learning"]].map(([v, l]) => (
              <div key={l} style={box({ flex: 1, padding: 20, ...col(12) })}>
                <p style={t(26, 800, C.ink, { lineHeight: "39px" })}>{v}</p>
                <p style={t(11, 600, C.mute)}>{l}</p>
              </div>
            ))}
          </div>
          <Note>Example rewards only. XP amounts and token earning rules are not finalized.</Note>
          <div style={row(16)}>
            <Btn w={220} onClick={on.review}>Review answers →</Btn>
            <Link onClick={on.retry}>Retry quiz</Link>
            <Link onClick={on.back}>Back to learning path</Link>
          </div>
        </div>
        <div style={box({ padding: 20, ...col(12) })}>
          <p style={t(18, 800)}>Your next learning step</p>
          <p style={t(13, 500, C.mute)}>Question 6: LEFT JOIN · Question 9: HAVING. Review both explanations, then revisit the SQL lesson before another attempt.</p>
          <Link onClick={on.back}>Revisit joins and grouping →</Link>
        </div>
      </div>
      <aside style={{ width: 320, ...col(16) }}>
        <div style={box({ padding: 24, ...col(14) })}>
          <p style={t(16, 800)}>What went well</p>
          {["SELECT and DISTINCT", "WHERE filters", "Aggregates and NULL"].map((s) => <p key={s} style={t(13, 700, C.green)}>✓ {s}</p>)}
          <hr style={{ border: 0, height: 1, background: C.ink, width: "100%", margin: 0 }} />
          <p style={t(13, 800)}>Keep practicing</p>
          <p style={t(13, 500, C.mute)}>LEFT JOIN preserves unmatched rows. HAVING filters aggregated groups.</p>
        </div>
        <div style={box({ padding: 24, ...row(12) })}>
          <div style={{ width: 44, height: 44, flex: "none", background: C.lime, border: `2px solid ${C.ink}`, borderRadius: 6 }} />
          <div>
            <p style={t(13, 800)}>First path completed</p>
            <p style={t(11, 500, C.mute)}>Earned · 28 September</p>
          </div>
        </div>
        <Note>A quiz is a snapshot, not the whole picture. Your effort is what moves you forward.</Note>
      </aside>
    </div>
  );
}