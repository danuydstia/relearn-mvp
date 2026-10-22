/**
 * Frontend-only learning-path fixture.
 *
 * The learning path screens (A03 / A04) are designed, but there is no path or
 * lesson API yet. This module is the single source for the demo path so the
 * pages, the dashboard entry points and the verification script cannot drift
 * apart. The shapes mirror what a future API can return.
 *
 * Design: A03 129:27980, A04 129:28250.
 */

export const DEMO_PATH_SLUG = 'introduction-to-database-systems'
export const DEMO_MODULE_SLUG = 'relational-database-design'

/**
 * @typedef {'completed' | 'in_progress' | 'locked'} ModuleStatus
 *
 * @typedef {object} LearningModule
 * @property {string} slug
 * @property {string} title
 * @property {ModuleStatus} status
 * @property {number} completedTopics
 * @property {number} totalTopics
 * @property {string} summary
 * @property {string} [lockedReason]
 * @property {string[]} [topics]
 */

/** @type {{ slug: string, title: string, sourceFile: string, totalTopics: number, completedTopics: number, modules: LearningModule[], currentTopic: { title: string, next: string, moduleSlug: string }, quiz: { title: string, questions: number, minutes: number } }} */
export const learningPath = {
  slug: DEMO_PATH_SLUG,
  title: 'Introduction to Database Systems',
  sourceFile: 'Database Systems — Lecture 04.pdf',
  totalTopics: 8,
  completedTopics: 4,
  modules: [
    {
      slug: 'database-foundations',
      title: 'Database foundations',
      status: 'completed',
      completedTopics: 2,
      totalTopics: 2,
      summary: 'Tables, records and keys',
    },
    {
      slug: 'querying-with-sql',
      title: 'Querying with SQL',
      status: 'completed',
      completedTopics: 2,
      totalTopics: 2,
      summary: 'SELECT, filters and joins',
    },
    {
      slug: DEMO_MODULE_SLUG,
      title: 'Relational design',
      status: 'in_progress',
      completedTopics: 0,
      totalTopics: 2,
      summary: 'Relational design · Functional dependencies',
    },
    {
      slug: 'normalization',
      title: 'Normalization',
      status: 'locked',
      completedTopics: 0,
      totalTopics: 2,
      summary: 'Normal forms · Putting it together',
      lockedReason: 'Complete module 3 first',
      topics: ['Normalization', 'Putting it together'],
    },
  ],
  currentTopic: {
    title: 'Relational Database Design',
    next: 'Functional dependencies',
    moduleSlug: DEMO_MODULE_SLUG,
  },
  quiz: {
    title: 'SQL Fundamentals',
    questions: 10,
    minutes: 8,
  },
}

/**
 * The one lesson with designed content. Previous and next topics exist in the
 * outline but have no story yet, which is why the page renders those actions
 * disabled instead of inventing copy.
 */
export const relationalDesignLesson = {
  moduleSlug: DEMO_MODULE_SLUG,
  moduleNumber: 3,
  topicNumber: 5,
  totalTopics: 8,
  minutes: 8,
  badge: 'READ · UNDERSTAND · APPLY',
  title: 'Design tables around one idea',
  intro:
    'A relational database organizes data into tables. Each row represents one record; each column represents an attribute. Good design keeps one kind of entity in each table and connects related entities with keys.',
  sections: [
    {
      title: '1. Separate students and enrollments',
      paragraphs: [
        'Imagine a university in Bandung. A student can take several courses, and each course can have many students. Storing every course in one student row creates repeating fields and makes updates difficult.',
      ],
      example: [
        'Students (student_id PK, name, city)',
        'Courses (course_id PK, title)',
        'Enrollments (student_id FK, course_id FK, semester)',
      ],
    },
    {
      title: '2. Use keys to preserve relationships',
      paragraphs: [
        'A primary key uniquely identifies a row. Enrollments uses student_id and course_id as foreign keys, so each enrollment refers to an existing student and course. Together, those keys model a many-to-many relationship.',
      ],
    },
  ],
  keyTakeaway:
    'Key takeaway: store a fact once, then use keys to connect it. Next, we’ll use functional dependencies to check whether attributes belong together.',
}

export const learningPathUrl = (pathSlug = DEMO_PATH_SLUG) => `/learning/${pathSlug}`

export const moduleUrl = (moduleSlug = DEMO_MODULE_SLUG, pathSlug = DEMO_PATH_SLUG) =>
  `${learningPathUrl(pathSlug)}/modules/${moduleSlug}`
