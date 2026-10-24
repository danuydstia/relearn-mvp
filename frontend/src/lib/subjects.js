/**
 * Data contoh untuk halaman Materials (sesuai desain Figma).
 * Ganti dengan data API kalau endpoint subject sudah ada; bentuk objeknya
 * sengaja dibuat sederhana: { slug, title, notes: [...], exams: [...] }.
 */
export const subjects = [
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    notes: [
      {
        id: 'unit-testing-lab',
        title: 'Unit Testing Lab Using unittest and pytest',
        summary:
          'Material covering the concepts and practice of testing in Python using the unittest and pytest frameworks.',
        date: 'Feb 8',
      },
    ],
    exams: [],
  },
]

export const getSubject = (slug) => subjects.find((subject) => subject.slug === slug) ?? null

export const materialsUrl = () => '/materials'
export const subjectUrl = (slug) => `/materials/${slug}`