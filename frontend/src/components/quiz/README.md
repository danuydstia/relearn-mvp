# Quiz — catatan relasi file

Lokasi:
- Halaman : `C:\Project\ReLearn\frontend\src\pages`
- Komponen: `C:\Project\ReLearn\frontend\src\components\quiz`

Sidebar dan top bar **tidak** ada di sini (sudah ada di layout). File-file ini hanya isi area konten.

## Struktur

```
src/
├─ pages/
│  ├─ QuizIntroPage.jsx      → detail quiz sebelum mulai
│  ├─ QuizQuestionPage.jsx   → pengerjaan soal
│  ├─ QuizResultsPage.jsx    → hasil / skor
│  └─ QuizReviewPage.jsx     → review semua jawaban
└─ components/quiz/
   ├─ QuizShell.jsx          → pembungkus: judul, footer, switch state
   ├─ StateBlock.jsx         → tampilan loading / empty / error
   ├─ QuizIntro.jsx          → isi halaman Intro
   ├─ QuizQuestion.jsx       → isi halaman Question
   ├─ QuizResults.jsx        → isi halaman Results
   ├─ QuizReview.jsx         → isi halaman Review
   ├─ ui.jsx                 → Btn, Link, Pill, Note, Bone
   ├─ tokens.js              → warna + helper style (box, t, col, row, hr)
   ├─ copy.js                → judul halaman + teks semua state
   └─ sampleData.js          → data contoh (ganti dengan data API)
```

## Relasi (siapa import siapa)

```
pages/QuizXxxPage.jsx
 ├─ QuizShell            ← judul, footer, pilih state
 │   ├─ copy.js          ← HEAD, STATES, teks footer
 │   ├─ StateBlock       ← dipakai saat status ≠ "ready"
 │   │   ├─ ui.jsx
 │   │   └─ tokens.js
 │   ├─ ui.jsx
 │   └─ tokens.js
 ├─ QuizXxx (isi)        ← dipakai saat status = "ready"
 │   ├─ ui.jsx
 │   └─ tokens.js
 └─ sampleData.js        ← default prop `data` (hapus saat sudah pakai API)
```

Pemetaan page → isi:

| Page                 | view (di Shell) | Isi (components/quiz) |
|----------------------|-----------------|-----------------------|
| QuizIntroPage        | `intro`         | QuizIntro             |
| QuizQuestionPage     | `question`      | QuizQuestion          |
| QuizResultsPage      | `results`       | QuizResults           |
| QuizReviewPage       | `review`        | QuizReview            |

## Alur user

```
Intro → Question (berulang per soal) → Results → Review
  ▲                                       │
  └────────────── Retry quiz ─────────────┘
```

## Props page

Semua page punya `status` (`ready | loading | empty | error`) dan `data`.

| Page     | Callback                                                       |
|----------|----------------------------------------------------------------|
| Intro    | `onStart`, `onBack`, `onReview`, `onRetry`, `onEmpty`          |
| Question | `onSubmit(indexJawaban)`, `onExit`, `onRetry`, `onEmpty`       |
| Results  | `onReview`, `onRetry` (= Retry quiz), `onBack`, `onRefresh` (= tombol saat error), `onEmpty` |
| Review   | `onBackToResults`, `onRetry`, `onEmpty`                        |

- `onRetry` (Intro/Question/Review) dipanggil tombol di state **error**.
- `onEmpty` dipanggil tombol di state **empty**.

## Kalau mau ubah…

| Mau ubah                         | Edit file                  |
|----------------------------------|----------------------------|
| Teks judul / pesan loading, empty, error | `copy.js`          |
| Warna, border, ukuran font       | `tokens.js`                |
| Tombol, pill, link               | `ui.jsx`                   |
| Tampilan state loading/empty/error | `StateBlock.jsx`         |
| Layout isi satu halaman          | `QuizIntro/Question/Results/Review.jsx` |
| Judul + footer semua halaman     | `QuizShell.jsx`            |
| Sambungkan ke API                | di `pages/*` (ganti `data` + `status`) |

## Catatan

- Import dari page: `../components/quiz/...`
- Teks "Example student data · For design review only" masih ada di footer (`copy.js`). Hapus saat production.
- XP dan token masih ilustrasi (aturan reward belum final).
