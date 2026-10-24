export const SAMPLE = {
  name: "Nabila", total: 10, submitted: 3, hint: "Read every option. What happens to rows before SQL forms groups?",
  topics: ["SELECT and DISTINCT", "WHERE and logical filters", "INNER and LEFT JOIN", "GROUP BY and HAVING", "Aggregates and NULL"],
  last: { pct: 80, correct: 8 },
  question: { no: 4, text: "Which SQL clause filters individual rows before grouping?", options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"] },
  result: { pct: 80, correct: 8, xp: 80, tokens: 20, time: "6m 42s" },
  answers: [
    { no: 4, q: "Which SQL clause filters individual rows before grouping?", ok: true, yours: "B — WHERE", why: "WHERE filters individual rows before GROUP BY. HAVING filters groups after aggregation." },
    { no: 6, q: "Which join keeps every student, including students with no enrollment?", ok: false, yours: "INNER JOIN", right: "LEFT JOIN", why: "LEFT JOIN keeps all rows from the left table. Unmatched enrollment columns are NULL." },
    { no: 9, q: "Which clause filters groups where COUNT(*) is greater than 3?", ok: false, yours: "WHERE COUNT(*) > 3", right: "HAVING COUNT(*) > 3", why: "HAVING applies conditions after aggregation. WHERE cannot filter on COUNT(*) here." },
  ],
};