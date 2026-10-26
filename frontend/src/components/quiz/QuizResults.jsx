import { C, box, col, row, t } from './tokens';
import { Btn, Link, Note, Pill } from './ui';

export default function QuizResults({ d, on }) {
  // d berisi: title, score, total_questions, result (pct)
  const pct = d?.result?.pct || 0;
  const correct = d?.result?.correct || 0;
  const total = d?.total_questions || 1;
  
  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={{ flex: 1, ...col(16) }}>
        <div style={box({ padding: 28, ...col(20) })}>
          <div style={row(32)}>
            {/* Lingkaran Skor */}
            <div style={{ width: 160, flex: "none", ...col(12), alignItems: "center" }}>
              <div style={{ width: 160, height: 160, borderRadius: 999, border: `2px solid ${C.ink}`, display: "grid", placeItems: "center", background: `conic-gradient(${C.lime} ${pct}%, ${C.paper} 0)` }}>
                <span style={{ ...t(32, 800), width: 116, height: 116, background: "white", borderRadius: 999, display: "grid", placeItems: "center" }}>{pct}%</span>
              </div>
              <Note>Quiz score</Note>
            </div>
            
            {/* Teks Hasil */}
            <div style={{ flex: 1, ...col(8), alignItems: "flex-start" }}>
              <Pill>Practice complete</Pill>
              <h2 style={t(28, 800, C.ink, { lineHeight: "42px" })}>
                {pct >= 70 ? "Kerja bagus! Anda menguasainya." : "Terus semangat! Sedikit lagi."}
              </h2>
              <p style={t(14, 500, C.mute)}>
                Anda menjawab benar {correct} dari {total} soal.
              </p>
            </div>
          </div>
          
          <hr style={{ border: 0, height: 1, background: C.ink, width: "100%", margin: 0 }} />
          
          {/* Statistik (Hanya Waktu & Jawaban Benar, XP/Tokens dihapus) */}
          <div style={row(16)}>
            {[
              [`${correct} / ${total}`, "Correct Answers"], 
              ["Selesai", "Quiz Status"]
            ].map(([v, l]) => (
              <div key={l} style={box({ flex: 1, padding: 20, ...col(12) })}>
                <p style={t(26, 800, C.ink, { lineHeight: "39px" })}>{v}</p>
                <p style={t(11, 600, C.mute)}>{l}</p>
              </div>
            ))}
          </div>

          <div style={row(16)}>
            <Btn w={220} onClick={on.review}>Review answers →</Btn>
            <Link onClick={on.retry}>Retry quiz</Link>
            <Link onClick={on.back}>Back to learning path</Link>
          </div>
        </div>
      </div>
      
      {/* Sidebar Kanan */}
      <aside style={{ width: 320, ...col(16) }}>
        <div style={box({ padding: 24, ...col(14) })}>
          <p style={t(16, 800)}>What's next?</p>
          <p style={t(13, 500, C.mute)}>
            Anda bisa melihat pembahasan setiap soal atau mengulang kuis ini untuk meningkatkan skor Anda.
          </p>
          <hr style={{ border: 0, height: 1, background: C.ink, width: "100%", margin: 0 }} />
          <Link onClick={on.review}>Lihat Pembahasan →</Link>
        </div>
        <Note>A quiz is a snapshot, not the whole picture. Your effort is what moves you forward.</Note>
      </aside>
    </div>
  );
}