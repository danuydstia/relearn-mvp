import { useState } from "react";
import { C, box, col, row, t } from './tokens';
import { Btn, Link, Note, Pill } from './ui';

export default function QuizQuestion({ d, on }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  
  if (!d?.questions || d.questions.length === 0) {
    return <p style={t(16, 800, C.red)}>Tidak ada soal.</p>;
  }

  const q = d.questions[currentIdx];
  const isLast = currentIdx === d.questions.length - 1;
  const selectedAnswer = answers[q.id] || null;

  const handleSelect = (optKey) => {
    setAnswers({ ...answers, [q.id]: optKey });
  };

  const handleNext = () => {
    if (isLast) {
      on.submit(answers); // Kirim semua jawaban ke Halaman
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const submittedCount = Object.keys(answers).length;
  const pct = Math.round((submittedCount / d.questions.length) * 100);

  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={{ flex: 1, ...col(20) }}>
        
        {/* Header Progress */}
        <div style={row(16)}>
          <div style={{ width: 56, height: 56, borderRadius: 999, border: `2px solid ${C.ink}`, display: "grid", placeItems: "center", flex: "none",
            background: `conic-gradient(${C.lime} ${pct}%, ${C.paper} 0)` }}>
            <span style={{ ...t(13, 800), background: "white", borderRadius: 999, width: 40, height: 40, display: "grid", placeItems: "center" }}>{pct}%</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={t(13, 800)}>Question {currentIdx + 1} / {d.questions.length}</p>
            <p style={t(11, 600, C.mute)}>{submittedCount} answers submitted</p>
          </div>
          <Pill on={false}>Practice</Pill>
        </div>

        {/* Card Soal */}
        <fieldset style={box({ padding: 32, ...col(20), margin: 0, minWidth: 0 })}>
          <legend style={{ display: "none" }}>{q.question_text}</legend>
          <p style={t(11, 800)}>QUESTION {currentIdx + 1} OF {d.questions.length} · SINGLE CHOICE</p>
          <p style={t(24, 800, C.ink, { lineHeight: "36px" })}>{q.question_text}</p>
          
          <div style={col(12)}>
            {q.options.map((opt, i) => {
              const key = String.fromCharCode(65 + i); // A, B, C, D
              const sel = selectedAnswer === key;
              return (
                <label key={key} style={{ ...box({ minHeight: 64, padding: "12px 16px", background: sel ? C.lime : "white", cursor: "pointer" }), display: "flex", alignItems: "center", gap: 14 }}>
                  <input type="radio" name="answer" checked={sel} onChange={() => handleSelect(key)} style={{ position: "absolute", opacity: 0 }} />
                  <span style={{ ...t(13, 800), width: 20 }}>{key}</span>
                  <span style={{ ...t(14, 700), flex: 1 }}>{opt}</span>
                  <span style={{ width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${C.ink}`, background: sel ? C.ink : "white", boxShadow: sel ? "inset 0 0 0 3px white" : "none" }} />
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Tombol Navigasi */}
        <div style={row(16)}>
          <Link onClick={() => currentIdx > 0 ? setCurrentIdx(currentIdx - 1) : on.exit()}>
            {currentIdx > 0 ? "Previous question" : "Exit quiz"}
          </Link>
          <Note>{selectedAnswer === null ? "Choose one answer" : "Ready to submit"}</Note>
          <span style={{ flex: 1 }} />
          <Btn w={200} disabled={selectedAnswer === null} onClick={handleNext}>
            {isLast ? "Finish & See Results" : "Submit & Next"}
          </Btn>
        </div>
        <Note>Answers save after submission. You can leave and resume this practice quiz.</Note>
      </div>

      {/* Sidebar Kanan */}
      <aside style={{ width: 264, ...col(16) }}>
        <div style={box({ padding: 20, ...col(16) })}>
          <p style={t(16, 800)}>Your attempt</p>
          <div><Pill>Practice · No timer</Pill></div>
          <p style={t(13, 500, C.mute)}>Soal 1–{currentIdx} terjawab. Soal {currentIdx + 1} siap dijawab.</p>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Array.from({ length: d.questions.length }, (_, i) => i + 1).map((n, idx) => {
               const qId = d.questions[idx].id;
               const isAnswered = !!answers[qId];
               const isCurrent = idx === currentIdx;
               return <Pill key={n} on={isCurrent || isAnswered}>{isAnswered ? `${n} ✓` : n}</Pill>
            })}
          </div>
          <Note>A complete answer review is available after all {d.questions.length} questions.</Note>
        </div>
      </aside>
    </div>
  );
}