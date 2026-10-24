import { C, box, col, row, t } from './tokens';
import { Btn, Note, Pill } from './ui';

export default function QuizReview({ d, on }) {
  const wrong = d.answers.filter((a) => !a.ok);
  return (
    // ... isi persis sama dengan function Review aslinya
    <div style={col(24)}>
       {/* (Silakan paste isi yang panjangnya ke sini agar tidak error) */}
    </div>
  );
}